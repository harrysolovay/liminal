import * as Schema from "effect/Schema"
import * as SchemaAST from "effect/SchemaAST"

export type JsonValue = null | boolean | number | string | JsonValueArray | JsonValueObject

export type JsonValueArray = Array<JsonValue> | ReadonlyArray<JsonValue>

export type JsonValueObject = { [key: string]: JsonValue }

export const encodeJsonc: <A, I extends JsonValue>(schema: Schema.Schema<A, I>) => (value: A) => string = (
  schema,
) => {
  const encoder = encodeAstJsonc(SchemaAST.encodedAST(schema.ast))
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
    const description = extractAnnotation(type)?.trim()
    if (description) {
      return `// ${description}\n${this.childIndentation}`
    }
    return ""
  }
}

const encodeAstJsonc: (ast: SchemaAST.AST) => (value: unknown, ctx: EncodeJsoncContext) => string = (ast) => {
  switch (ast._tag) {
    case "TypeLiteral": {
      return (value, ctx) => {
        const props = ast.propertySignatures
          .map(({ name, type }) => {
            if (typeof name === "symbol") throw 0

            const child = encodeAstJsonc(type)((value as never)[name], ctx.next())
            return `${ctx.comment(type)}${name}: ${child}`
          })
          .join(`,\n${ctx.childIndentation}`)
        return `{\n${ctx.childIndentation}${props}\n${ctx.indentation}}`
      }
    }
    case "StringKeyword": {
      return (value) => `"${value}"`
    }
    case "NumberKeyword": {
      return (value) => `${value}`
    }
    case "Literal": {
      const { literal } = ast
      if (typeof literal === "string") {
        return () => `"${literal}"`
      }
      if (typeof literal === "number" || typeof literal === "boolean") {
        return () => String(literal)
      }
      if (literal === null) {
        return () => "null"
      }
      throw 0
    }
    case "TupleType": {
      const { elements, rest } = ast
      return (value, ctx) => {
        const e = (elements.length ? elements : rest).map((element, i) => {
          const child = encodeAstJsonc(element.type)((value as never)[i]!, ctx.next())
          return `${ctx.comment(element.type)}${child}`
        }).join(`,\n${ctx.childIndentation}`)
        return `[\n${ctx.childIndentation}${e}\n${ctx.indentation}]`
      }
    }
  }
  console.log(ast._tag)
  throw 0
}

const extractAnnotation = ({ annotations }: SchemaAST.AST): string | undefined => {
  if (SchemaAST.JSONSchemaAnnotationId in annotations) {
    const jsonSchemaAnnotations = annotations[SchemaAST.JSONSchemaAnnotationId] as
      | SchemaAST.Annotations
      | undefined
    if (jsonSchemaAnnotations) {
      return jsonSchemaAnnotations.description as string
    }
  }
  return
}
