import * as Effect from "effect/Effect"
import type * as Schema from "effect/Schema"
import type * as Strand from "./Strand.ts"
import { user } from "./user.ts"
import { encodeJsonc, type JsonValue } from "./util/JsonValue.ts"

/** Stringify and append some JSON as a user message to the conversation. */
export const userJson: <A, I extends JsonValue>(
  value: A,
  schema?: Schema.Schema<A, I>,
) => Effect.Effect<void, never, Strand.Strand> = Effect.fnUntraced(function*(value, schema) {
  const encoded = schema ? encodeJsonc(schema)(value) : JSON.stringify(value, null, 2)
  return yield* user`\`\`\`json${schema ? "c" : ""}${"\n"}${encoded}${"\n"}\`\`\``
})
