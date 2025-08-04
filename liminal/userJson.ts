import type * as Effect from "effect/Effect"
import type * as Schema from "effect/Schema"
import type * as Strand from "./Strand.ts"
import { user } from "./user.ts"
import type { JsonValueObject } from "./util/JsonValue.ts"

// TODO: serialize with comments from schema
/** Stringify and append some JSON as a user message to the conversation. */
export const userJson: <A, I extends JsonValueObject>(
  value: A,
  schema?: Schema.Schema<A, I, never>,
) => Effect.Effect<void, never, Strand.Strand> = (value) => user`\`\`\`jsonc\n${JSON.stringify(value, null, 2)}\n\`\`\``
