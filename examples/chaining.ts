import { Effect, Schema, Stream } from "effect"
import { L, Strand } from "liminal"
import { model } from "./_layers.ts"
import { logLEvent } from "./_logLEvent.ts"

Effect.gen(function*() {
  yield* L.events.pipe(
    Stream.runForEach(logLEvent),
    Effect.fork,
  )

  yield* L.user`Please generate the first draft.`
  let copy = yield* L.assistant
  yield* L.user`
    Now evaluate this marketing copy for:

    1. Presence of call to action (true/false)
    2. Emotional appeal (1-10)
    3. Clarity (1-10)

    Copy to evaluate: ${copy}
  `
  const qualityMetrics = yield* L.assistantStruct({
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
  Effect.provide(
    Strand.new`Write persuasive marketing copy for: Buffy The Vampire Slayer. Focus on benefits and emotional appeal.`,
  ),
  Effect.provide(model),
  Effect.runPromise,
).then(console.log)
