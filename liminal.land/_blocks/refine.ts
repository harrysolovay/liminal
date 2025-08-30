import { Effect } from "effect"
import { L } from "liminal"

// ---cut---
export const refine = (content: string) =>
  Effect.gen(function*() {
    // For 5 iterations.
    for (let i = 0; i < 5; i++) {
      // Append a message asking for the refinement.
      yield* L.user`Refine the following text: ${content}`
      // Infer and reassign `content` to an assistant message.
      content = yield* L.assistant
    }
    // Return the final `content`.
    return content
  }).pipe(
    // Denotes the boundary of the conversation.
    // Conceptually similar to `Effect.scoped`.
    L.scoped(
      L.thread,
    ),
  )
