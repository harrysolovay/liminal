import { Effect, Schema } from "effect"
import L from "liminal"
import { ModelLive } from "./_layers.ts"
import { logger } from "./_logger.ts"

Effect.gen(function*() {
  yield* logger

  yield* L.system`Write persuasive marketing copy for: Buffy The Vampire Slayer.`
  yield* L.user`Please generate the first draft.`
  let copy = yield* L.assistant
  yield* L.user`
    Now evaluate this marketing copy for:

    1. Presence of call to action (true/false)
    2. Emotional appeal (1-10)
    3. Clarity (1-10)

    Copy to evaluate: ${copy}
  `
  const qualityMetrics = yield* L.assistantSchema({
    hasCallToAction: Schema.Boolean,
    emotionalAppeal: Schema.Number,
    clarity: Schema.Number,
  })
  if (!qualityMetrics.hasCallToAction || qualityMetrics.emotionalAppeal < 7 || qualityMetrics.clarity < 7) {
    yield* L.user`
      Rewrite this marketing copy with:

      ${!qualityMetrics.hasCallToAction ? "- A clear call to action" : ""}
      ${qualityMetrics.emotionalAppeal < 7 ? "- Stronger emotional appeal" : ""}
      ${qualityMetrics.clarity < 7 ? "- Improved clarity and directness" : ""}

      Original copy: ${copy}
    `
    copy = yield* L.assistant
  }
  return { copy, qualityMetrics }
}).pipe(
  L.root,
  Effect.scoped,
  Effect.provide(ModelLive),
  Effect.runFork,
)
