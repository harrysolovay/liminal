import { Effect } from "effect"
import { L } from "liminal"

// ---cut---
const conversation = Effect.gen(function*() {
  // Append some initial messages.
  yield* L.user`...`
  yield* L.assistant
  yield* L.user`...`
  yield* L.assistant

  // Ask for a summary.
  yield* L.user`Summarize our conversation.`
  const summary = yield* L.assistant

  // Clear the current conversation.
  yield* L.clear

  // Append the summary.
  yield* L.user`Conversation summary: ${summary}`
})
