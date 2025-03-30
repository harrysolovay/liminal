import { openai } from "@ai-sdk/openai"
import { type } from "arktype"
import { Conversation, Inference, Model, SystemMessage } from "liminal"
import { AILanguageModel } from "liminal-ai"

Conversation(TranslationWithFeedback("typescript", "I love you!"))
  .models({
    default: AILanguageModel(openai("gpt-4o-mini")),
  })
  .reduce(console.log)

function* TranslationWithFeedback(targetLanguage: string, text: string) {
  yield* SystemMessage(
    "You are an expert literary translator. Translate the supplied text to the specified target language, preserving tone and cultural nuances.",
  )
  yield* Model.language("default")
  yield `Target language: ${targetLanguage}`
  yield `Text:

    ${text}
  `
  let currentTranslation = yield* Inference()
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
    const evaluation = yield* Inference(
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
      evaluation.qualityScore >= 8
      && evaluation.preservesTone
      && evaluation.preservesNuance
      && evaluation.culturallyAccurate
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
    const improvedTranslation = yield* Inference()
    currentTranslation = improvedTranslation
    iterations++
  }
  return {
    finalTranslation: currentTranslation,
    iterationsRequired: iterations,
  }
}
