import { Generation, Context, Model } from "liminal"
import { type } from "arktype"
import { AILanguageModel } from "liminal-ai"
import { openai } from "@ai-sdk/openai"

await TranslationWithFeedback("typescript", "I love you!").exec({
  models: {
    language: {
      default: AILanguageModel(openai("gpt-4o-mini")),
    },
  },
})

function TranslationWithFeedback(targetLanguage: string, text: string) {
  return Context(
    "TranslateWithFeedback",
    "You are an expert literary translator. Translate the supplied text to the specified target language, preserving tone and cultural nuances.",
    function* () {
      yield* Model("default")
      yield `Target language: ${targetLanguage}`
      yield `Text:

        ${text}
      `
      let currentTranslation = yield* Generation()
      let iterations = 0
      const MAX_ITERATIONS = 3
      while (iterations < MAX_ITERATIONS) {
        yield `
          Evaluate this translation:

          Original: ${text}
          Translation: ${currentTranslation}

          Consider:
          1. Overall quality
          2. Preservation of tone
          3. Preservation of nuance
          4. Cultural accuracy
        `
        const evaluation = yield* Generation(
          type({
            qualityScore: "1 <= number.integer <= 10",
            preservesTone: "boolean",
            preservesNuance: "boolean",
            culturallyAccurate: "boolean",
            specificIssues: "string[]",
            improvementSuggestions: "string[]",
          }),
        )
        if (
          evaluation.qualityScore >= 8 &&
          evaluation.preservesTone &&
          evaluation.preservesNuance &&
          evaluation.culturallyAccurate
        ) {
          break
        }
        yield `
          Improve this translation based on the following feedback:

          ${evaluation.specificIssues.join("\n")}
          ${evaluation.improvementSuggestions.join("\n")}

          Original: ${text}
          Current Translation: ${currentTranslation}
        `
        const improvedTranslation = yield* Generation()
        currentTranslation = improvedTranslation
        iterations++
      }
      return {
        finalTranslation: currentTranslation,
        iterationsRequired: iterations,
      }
    },
  )
}
