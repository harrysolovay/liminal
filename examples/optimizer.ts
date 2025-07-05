import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import { L, strand } from "liminal"
import { common } from "./_common.ts"

const TEXT = "..."

Effect.gen(function*() {
  yield* L.user`Target language: typescript`
  yield* L.user`Text:\n\n${TEXT}`
  let currentTranslation = yield* L.assistant()
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
    const evaluation = yield* L.assistant(Schema.Struct({
      qualityScore: Schema.Int,
      preservesTone: Schema.Boolean,
      preservesNuance: Schema.Boolean,
      culturallyAccurate: Schema.Boolean,
      specificIssues: Schema.Array(Schema.String),
      improvementSuggestions: Schema.Array(Schema.String),
    }))
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
    currentTranslation = yield* L.assistant()
    iterations += 1
  }
  return {
    finalTranslation: currentTranslation,
    iterationsRequired: iterations,
  }
}).pipe(
  strand({
    system:
      `You are an expert literary translator. Translate the supplied text to the specified target language, preserving tone and cultural nuances.`,
  }),
  common,
  Effect.runPromise,
)
