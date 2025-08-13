import * as Effect from "effect/Effect"
import type * as Schema from "effect/Schema"
import type { Thread } from "../Thread.ts"
import { encodeJsonc, type JsonValue } from "../util/JsonValue.ts"
import { user } from "./user.ts"

/** Stringify and append some JSON as a user message to the conversation. */
export const userJson: <A, I extends JsonValue>(
  value: A,
  schema?: Schema.Schema<A, I>,
) => Effect.Effect<void, never, Thread> = Effect.fnUntraced(function*(value, schema) {
  const encoded = schema ? encodeJsonc(schema)(value) : JSON.stringify(value, null, 2)
  return yield* user`\`\`\`json${schema ? "c" : ""}${"\n"}${encoded}${"\n"}\`\`\``
})
