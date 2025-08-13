import { Effect } from "effect"
import L from "liminal"

const conversation = Effect.gen(function*() {
  // Append a user message.
  yield* L.user`Where is the pot of gold?`

  // Infer and append an assistant message.
  const loc = yield* L.assistant

  // Use the reply.
  loc satisfies string
})
