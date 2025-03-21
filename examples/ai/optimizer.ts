import { AssistantText, AssistantValue, Agent } from "liminal"
import { type } from "arktype"

function TranslateWithFeedbackAgent(targetLanguage: string, text: string) {
  return Agent(
    "TranslateWithFeedback",
    "You are an expert literary translator. Translate the supplied text to the specified target language, preserving tone and cultural nuances.",
    function* () {
      yield `Target language: ${targetLanguage}`
      yield `Text:

        ${text}
      `
      let currentTranslation = yield* AssistantText()
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
        const evaluation = yield* AssistantValue(
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
        const improvedTranslation = yield* AssistantText()
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
