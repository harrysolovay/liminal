import { openai } from "@ai-sdk/openai"
import { exec, L } from "liminal"
import { AILanguageModel } from "liminal-ai"

exec(TranslationWithFeedback("typescript", "I love you!"), {
  bind: {
    default: AILanguageModel(openai("gpt-4o-mini")),
  },
  handler: console.log,
})

function* TranslationWithFeedback(targetLanguage: string, text: string) {
  yield* L.declareLanguageModel("default")
  yield* L
    .system`You are an expert literary translator. Translate the supplied text to the specified target language, preserving tone and cultural nuances.`
  yield* L.user`Target language: ${targetLanguage}`
  yield* L.user`Text:

    ${text}
  `
  let currentTranslation = yield* L.infer()
  let iterations = 0
  const MAX_ITERATIONS = 3
  while (iterations < MAX_ITERATIONS) {
    yield* L.user`
      Evaluate this translation:

      Original: ${text}
      Translation: ${currentTranslation}

      Consider:
      1. Overall quality
      2. Preservation of tone
      3. Preservation of nuance
      4. Cultural accuracy
    `
    const evaluation = yield* L.object({
      qualityScore: L.integer`Between 1 and 10, inclusive.`,
      preservesTone: L.boolean,
      preservesNuance: L.boolean,
      culturallyAccurate: L.boolean,
      specificIssues: L.array(L.string),
      improvementSuggestions: L.array(L.string),
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

      Original: ${text}
      Current Translation: ${currentTranslation}
    `
    currentTranslation = yield* L.infer()
    iterations++
  }
  return {
    finalTranslation: currentTranslation,
    iterationsRequired: iterations,
  }
}
