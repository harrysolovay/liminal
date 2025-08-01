import { Effect, Schema, Stream } from "effect"
import { L, Strand } from "liminal"
import { model } from "./_layers.ts"
import { logLEvent } from "./_logLEvent.ts"

const TEXT = "..."

Effect.gen(function*() {
  yield* L.events.pipe(
    Stream.runForEach(logLEvent),
    Effect.fork,
  )

  yield* L.user`Target language: typescript`
  yield* L.user`Text:\n\n${TEXT}`
  let currentTranslation = yield* L.assistant
  let iterations = 0
  const MAX_ITERATIONS = 3
  while (iterations < MAX_ITERATIONS) {
    yield* L.user`
      Evaluate this translation:

      Original: ${TEXT}
      Translation: ${currentTranslation}

      Consider:
      1. Overall quality
      2. Preservation of tone
      3. Preservation of nuance
      4. Cultural accuracy
    `
    const evaluation = yield* L.assistantStruct({
      qualityScore: Schema.Int,
      preservesTone: Schema.Boolean,
      preservesNuance: Schema.Boolean,
      culturallyAccurate: Schema.Boolean,
      specificIssues: Schema.Array(Schema.String),
      improvementSuggestions: Schema.Array(Schema.String),
    })
    if (
      evaluation.qualityScore >= 8
      && evaluation.preservesTone
      && evaluation.preservesNuance
      && evaluation.culturallyAccurate
    ) {
      break
    }
    yield* L.user`
      Improve this translation based on the following feedback:

      ${evaluation.specificIssues.join("\n")}
      ${evaluation.improvementSuggestions.join("\n")}

      Original: ${TEXT}
      Current Translation: ${currentTranslation}
    `
    currentTranslation = yield* L.assistant
    iterations += 1
  }
  return {
    finalTranslation: currentTranslation,
    iterationsRequired: iterations,
  }
}).pipe(
  Effect.provide(
    Strand.new`
      You are an expert literary translator. Translate the supplied text to the
      specified target language, preserving tone and cultural nuances.
    `,
  ),
  Effect.provide(model),
  Effect.runPromise,
)
