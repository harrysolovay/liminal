import type { AiError } from "@effect/ai/AiError"
import { AssistantMessage, TextPart } from "@effect/ai/AiInput"
import { AiLanguageModel } from "@effect/ai/AiLanguageModel"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import * as Schema from "effect/Schema"
import * as SchemaAST from "effect/SchemaAST"
import type { Thread } from "../Thread.ts"
import { encodeJsonc, type JsonValue } from "../util/JsonValue.ts"
import { append } from "./append.ts"
import { self } from "./self1.ts"

/** Infer a structured assistant message and append its JSON representation to the conversation. */
export const assistantSchema: {
  <F extends Record<string, Schema.Schema.AnyNoContext>>(
    fields: F,
  ): Effect.Effect<{ [K in keyof F]: Schema.Schema.Type<F[K]> }, AiError, AiLanguageModel | Thread>
  <O, I extends JsonValue>(
    schema: Schema.Schema<O, I, never>,
  ): Effect.Effect<O, AiError, AiLanguageModel | Thread>
} = Effect.fnUntraced(function*(schema) {
  const model = yield* AiLanguageModel
  const { state: { system, messages } } = yield* self

  const isSchema = Schema.isSchema(schema)
  const schema_ = isSchema ? schema : Schema.Struct(schema) as Schema.Schema.AnyNoContext
  const isObject = !isSchema || isObjectSchema(SchemaAST.encodedAST(schema.ast))
  const wrapped = isObject ? schema_ : Schema.Struct({ inner: schema_ })

  const value = yield* model.generateObject({
    system: Option.getOrUndefined(system),
    schema: wrapped,
    prompt: messages,
  }).pipe(
    Effect.map(({ value }) => isObject ? value : value["inner"]),
  )

  yield* append(
    AssistantMessage.make({
      parts: [
        TextPart.make({
          text: yield* encodeJsonc(schema_)(value),
        }),
      ],
    }),
  )
  return value
})

const isObjectSchema = (ast: SchemaAST.AST): boolean => {
  switch (ast._tag) {
    case "TypeLiteral": {
      return true
    }
    case "Refinement":
    case "Transformation": {
      return isObjectSchema(ast.from)
    }
  }
  return false
}
