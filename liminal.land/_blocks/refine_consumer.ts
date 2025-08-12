import { Effect, Schema } from "effect"
import L from "liminal"

// ---cut---
import { refine } from "./refine.ts"

const maybeRefine = Effect.fn(function*(content: string) {
  // Ask whether to utilize the pattern.
  yield* L.user`Does the following text require refinement?: ${content}`
  // Have the model answer our question.
  const { needsRefinement } = yield* L.assistantSchema({
    needsRefinement: Schema.Boolean,
  })
  // If so...
  if (needsRefinement) {
    // Refine and return.
    return yield* refine(content)
  }
  // Otherwise, return the initial content.
  return content
})
