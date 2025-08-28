import { Terminal } from "@effect/platform"
import { BunContext } from "@effect/platform-bun"
import { Effect, Schema } from "effect"
import { L } from "liminal"
import { ModelLive } from "./_layers.ts"
import { logger } from "./_logger.ts"

const TEXT = "..."

Effect.gen(function*() {
  yield* logger

  yield* L.user`
    You are an expert literary translator. Translate the supplied text to the
    specified target language, preserving tone and cultural nuances.
  `
  yield* L.user`Target language: typescript`
  yield* Effect.sleep(100)

  const term = yield* Terminal.Terminal
  yield* term.display("Please input the text to be translated:\n")

  yield* L.user`Text:\n\n${term.readLine}`
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
    const evaluation = yield* L.assistantSchema({
      qualityScore: Schema.Int,
      preservesTone: Schema.Boolean,
      preservesNuance: Schema.Boolean,
      culturallyAccurate: Schema.Boolean,
      specificIssues: Schema.Array(Schema.String),
      improvementSuggestions: Schema.Array(Schema.String),
    })
    if (
      evaluation.qualityScore >= 8 && evaluation.preservesTone && evaluation.preservesNuance
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
  L.make(
    L.thread,
  ),
  Effect.scoped,
  Effect.provide([ModelLive, BunContext.layer]),
  Effect.runFork,
)
