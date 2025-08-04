import { Effect } from "effect"
import { L } from "liminal"

// ---cut---
export const reducer = Effect.gen(function*() {
  yield* L.user`Please summarize the current conversation.`
  const summary = yield* L.assistant

  return Effect.gen(function*() {
    yield* L.user`Here is a summary of the reduced conversation: ${summary}.`
  })
})
