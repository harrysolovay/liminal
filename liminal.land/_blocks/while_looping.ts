import { Effect, Schema } from "effect"
import { L } from "liminal"

// ---cut---
Effect.gen(function*() {
  while (true) {
    // Ask the assistant whether to move on.
    yield* L.user`Are we done with this part of the conversation?`
    const { finished } = yield* L.assistantSchema({
      finished: Schema.Boolean,
    })

    // If finished, move onto the next part of the conversation.
    if (finished) break
  }
  // The conversation continues...
})
