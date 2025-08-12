import { Effect } from "effect"
declare const conversation: Effect.Effect<void>
import L from "liminal"

// ---cut---
Effect.gen(function*() {
  // Run in the current conversation.
  yield* conversation

  // Run isolated with an untouched state.
  yield* conversation.pipe(L.root)

  // Run isolated with a copy of the current state.
  yield* conversation.pipe(L.branch)
}).pipe(
  L.root,
)
