import * as Effect from "effect/Effect"
import { pipe } from "effect/Function"
import * as Option from "effect/Option"
import * as Schema from "effect/Schema"
import * as SchemaAST from "effect/SchemaAST"

export type JsonValue = null | boolean | number | string | JsonValueArray | JsonValueObject

export type JsonValueArray = Array<JsonValue> | ReadonlyArray<JsonValue>

export type JsonValueObject = { [key: string]: JsonValue }

export const encodeJsonc: <A, I extends JsonValue>(
  schema: Schema.Schema<A, I>,
) => (value: A) => Effect.Effect<string> = (schema) => {
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

  comment = (type: SchemaAST.AST): string =>
    Option.match(SchemaAST.getDescriptionAnnotation(type), {
      onSome: (v) => {
        v = v.trim()
        if (v) {
          return `// ${v}\n${this.childIndentation}`
        }
        return ""
      },
      onNone: () => "",
    })
}

const encodeAst: (ast: SchemaAST.AST) => (value: unknown, ctx: EncodeJsoncContext) => Effect.Effect<string> = (ast) => {
  switch (ast._tag) {
    case "TypeLiteral": {
      return Effect.fnUntraced(function*(value, ctx) {
        const props = yield* Effect.all(
          ast.propertySignatures.map(
            Effect.fnUntraced(function*({ name, type }) {
              if (typeof name === "symbol") throw 0
              const child = yield* encodeAst(type)((value as never)[name], ctx.next())
              return `${ctx.comment(type)}${name}: ${child}`
            }),
          ),
        ).pipe(
          Effect.map((v) => v.join(`,\n${ctx.childIndentation}`)),
        )
        return `{\n${ctx.childIndentation}${props}\n${ctx.indentation}}`
      })
    }
    case "StringKeyword": {
      return (value) => Effect.succeed(`"${value}"`)
    }
    case "BooleanKeyword":
    case "NumberKeyword": {
      return (value) => Effect.succeed(String(value))
    }
    case "UnknownKeyword":
    case "AnyKeyword": {
      return (value, ctx) =>
        Effect.succeed(
          JSON
            .stringify(value, null, 2)
            .split("\n")
            .map((line, i) => i ? ctx.indentation.concat(line) : line)
            .join("\n"),
        )
    }
    case "Union": {
      const { types } = ast
      const guards = types.map((ast) =>
        pipe(
          ast,
          Schema.make,
          Schema.is,
        )
      )
      return (value, ctx) => {
        for (let i = 0; i < types.length; i++) {
          const guard = guards[i]!
          if (guard(value)) {
            return encodeAst(types[i]!)(value, ctx)
          }
        }
        throw 0
      }
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
      return () => Effect.succeed(v)
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
        return Effect.succeed(`[\n${ctx.childIndentation}${e}\n${ctx.indentation}]`)
      }
    }
    case "Suspend": {
      return encodeAst(ast.f())
    }
  }
  console.log({ ast })
  throw 0
}

encodeJsonc(Schema.Struct({
  a: Schema.Boolean.annotations({
    description: "The first field description.",
  }),
  b: Schema.Int.annotations({
    description: "LLMs are gonna love this.",
  }),
  c: Schema.Any.annotations({
    description: "Hi gcanti!",
  }),
  d: Schema.Union(
    Schema.String,
    Schema.Number,
    Schema.Struct({
      sup: Schema.Boolean.annotations({
        description: "SUP THIS IS GONNA BE COOL",
      }),
    }),
  ).annotations({
    description: "YET ANOTHER",
  }),
}))({
  a: true,
  b: 101,
  c: {
    hi: {
      there: "SUP",
    },
  },
  d: {
    sup: true,
  },
}).pipe(
  Effect.runSync,
  console.log,
)
