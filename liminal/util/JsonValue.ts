import * as Schema from "effect/Schema"
import * as SchemaAST from "effect/SchemaAST"

export type JsonValue = null | boolean | number | string | JsonValueArray | JsonValueObject

export type JsonValueArray = Array<JsonValue> | ReadonlyArray<JsonValue>

export type JsonValueObject = { [key: string]: JsonValue }

export const encodeJsonc: <A, I extends JsonValue>(schema: Schema.Schema<A, I>) => (value: A) => string = (
  schema,
) => {
  const encoder = encodeAst(SchemaAST.encodedAST(schema.ast))
  return (value) => encoder(value, new EncodeJsoncContext(0))
}

class EncodeJsoncContext {
  readonly depth: number
  readonly indentation: string
  readonly childIndentation: string
  constructor(depth: number) {
    this.depth = depth
    this.indentation = " ".repeat(depth * 2)
    this.childIndentation = " ".repeat((depth + 1) * 2)
  }

  next = () => new EncodeJsoncContext(this.depth + 1)

  comment = (type: SchemaAST.AST): string => {
    const { description } = type.annotations
    if (typeof description === "string") {
      const trimmed = description.trim()
      if (trimmed) {
        return `// ${trimmed}\n${this.childIndentation}`
      }
    }
    return ""
  }
}

const encodeAst: (ast: SchemaAST.AST) => (value: unknown, ctx: EncodeJsoncContext) => string = (ast) => {
  switch (ast._tag) {
    case "TypeLiteral": {
      return (value, ctx) => {
        const props = ast.propertySignatures
          .map(({ name, type }) => {
            if (typeof name === "symbol") throw 0

            const child = encodeAst(type)((value as never)[name], ctx.next())
            return `${ctx.comment(type)}${name}: ${child}`
          })
          .join(`,\n${ctx.childIndentation}`)
        return `{\n${ctx.childIndentation}${props}\n${ctx.indentation}}`
      }
    }
    case "StringKeyword": {
      return (value) => `"${value}"`
    }
    case "BooleanKeyword":
    case "NumberKeyword": {
      return String
    }
    case "AnyKeyword": {
      return (value, ctx) =>
        JSON
          .stringify(value, null, 2)
          .split("\n")
          .map((line, i) => i ? ctx.indentation.concat(line) : line)
          .join("\n")
    }
    case "Union": {
      // TODO
      throw 0
    }
    case "Literal": {
      const { literal } = ast
      const v = (() => {
        switch (typeof literal) {
          case "boolean":
          case "number": {
            return String(literal)
          }
          case "string": {
            return `"${literal}"`
          }
        }
        if (literal === null) {
          return "null"
        }
        console.log({ literal })
        throw 0
      })()
      return () => v
    }
    case "TupleType": {
      const { elements, rest } = ast
      return (value, ctx) => {
        const e = (elements.length ? elements : rest)
          .map((element, i) => {
            const child = encodeAst(element.type)((value as never)[i]!, ctx.next())
            return `${ctx.comment(element.type)}${child}`
          })
          .join(`,\n${ctx.childIndentation}`)
        return `[\n${ctx.childIndentation}${e}\n${ctx.indentation}]`
      }
    }
  }
  console.log({ ast })
  throw 0
}

const v = encodeJsonc(Schema.Struct({
  a: Schema.Boolean.annotations({
    description: "Hey there.",
  }),
  b: Schema.Int,
  c: Schema.Any.annotations({
    description: "Hey there.",
  }),
}))({
  a: true,
  b: 101,
  c: {
    hi: {
      there: "SUP",
    },
  },
})
console.log(v)
