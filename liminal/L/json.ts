import * as Effect from "effect/Effect"
import type * as Schema from "effect/Schema"
import { encodeJsonc, type JsonValue } from "../util/JsonValue.ts"

/** Stringify and append some JSON as a user message to the conversation. */
export const json: <A, I extends JsonValue>(
  value: A,
  schema?: Schema.Schema<A, I>,
) => Effect.Effect<string> = Effect.fnUntraced(function*(value, schema) {
  const encoded = schema ? encodeJsonc(schema)(value) : JSON.stringify(value, null, 2)
  return `\`\`\`json${schema ? "c" : ""}\n${encoded}\n\`\`\``
})
