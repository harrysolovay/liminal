import { Effect } from "effect"
import { L } from "liminal"

// ---cut---
import { reducer } from "./summarize_reducer.ts"

Effect.gen(function*() {
  yield* L.user`...`
  yield* L.assistant
  yield* L.user`...`
  yield* L.assistant

  yield* reducer.pipe(
    L.reduce,
  )

  yield* L.messages // now contains a single message
})
