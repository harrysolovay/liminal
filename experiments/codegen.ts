import { mkdir, rmdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import type { JSON } from "./JSON.js"
import { xai } from "./xai-openapi.js"

const { components, paths } = xai
const { schemas } = components

export namespace Test {
  export const a = () => {}
  export function b() {}
}

const destDir = resolve(import.meta.dirname, "dest")
try {
  await rmdir(destDir)
} catch (_e: unknown) {}
try {
  await mkdir(destDir)
} catch (_e: unknown) {}

class ToTsTypeContext {
  readonly imports: Array<string> = []
}

const pending: Array<Promise<void>> = []

for (const [ident, schema] of Object.entries(schemas)) {
  const dest = resolve(destDir, `${ident}.ts`)
  let result = ""
  const ctx = new ToTsTypeContext()
  const typeCode = toTsType(ctx, schema as never)
  for (let i = 0; i < ctx.imports.length; i++) {
    const name = ctx.imports[i]!
    result += `import type { `
    result += name
    result += ` } from "./`
    result += name
    result += `.ts"`
    result += "\n"
  }
  if ("description" in schema) {
    result += `/** ${schema.description.trim()} */`
  }
  result += `\nexport type ${ident} =`
  result += typeCode
  pending.push(writeFile(dest, result))
}

// for (const [path, value] of Object.entries(paths)) {}

await Promise.all(pending)

function toTsType(ctx: ToTsTypeContext, schema: JSON.Schema): string {
  if (typeof schema.$ref === "string") {
    const ident = schema.$ref.split("/").pop()!
    ctx.imports.push(ident)
    return ident
  } else if (schema.anyOf) {
    return toTsUnionType(ctx, schema)
  } else if (schema.oneOf) {
    return toTsUnionType(ctx, schema)
  } else if (schema.type) {
    switch (schema.type) {
      case "null": {
        return "null"
      }
      case "boolean": {
        return "boolean"
      }
      case "integer":
      case "number": {
        return "number"
      }
      case "string": {
        if (schema.enum) {
          return `"${schema.enum.join(`" | "`)}"`
        }
        return "string"
      }
      case "array": {
        return `Array<${toTsType(ctx, schema.items)}>`
      }
      case "object": {
        return toTsObjectType(ctx, schema)
      }
    }
    return toTsLiteralUnionType(ctx, schema)
  } else {
    return "any"
  }
}

function toTsObjectType(ctx: ToTsTypeContext, schema: JSON.SchemaObjectType): string {
  let result = "{"
  for (const [key, value] of Object.entries(schema.properties)) {
    if (typeof value.$ref === "string") {
      // ...
    } else {
      if (value.description) {
        result += `\n/** ${value.description.trim()} */`
      }
      result += "\n"
      result += key
      result += ":"
      result += toTsType(ctx, value)
      result += ","
    }
  }
  result += "}"
  return result
}

function toTsUnionType(ctx: ToTsTypeContext, schema: JSON.SchemaAnyOf | JSON.SchemaOneOf): string {
  const members = schema.anyOf ?? schema.oneOf
  let result = "("
  for (let i = 0; i < members.length; i++) {
    const member = members[i]!
    result += "| "
    result += toTsType(ctx, member)
    result += "\n"
  }
  result += ")"
  return result
}

function toTsLiteralUnionType(ctx: ToTsTypeContext, schema: JSON.SchemaTypeUnion): string {
  let result = "(\n"
  for (let i = 0; i < schema.type.length; i++) {
    const current = schema.type[i]!
    switch (current) {
      case "string": {
        if ("enum" in schema) {
          for (let j = 0; j < schema.enum.length; j++) {
            result += `| "${schema.enum[j]}"`
          }
        } else {
          result += `"string"\n`
        }
        break
      }
      default: {
        result += `| ${current}\n`
        break
      }
    }
  }
  result += "\n)"
  return result
}
