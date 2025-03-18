import { Type, system } from "liminal"

export function* translateWithFeedback(text: string, targetLanguage: string) {
  yield* system`You are an expert literary translator.`
  yield `
    Translate this text to ${targetLanguage}, preserving tone and cultural nuances:

    ${text}
  `
  let currentTranslation = yield* Type.string
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
    const evaluation = yield* Type({
      qualityScore: Type.integer`Min of 1, max of 10`,
      preservesTone: Type.boolean,
      preservesNuance: Type.boolean,
      culturallyAccurate: Type.boolean,
      specificIssues: Type.array(Type.string),
      improvementSuggestions: Type.array(Type.string),
    })
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
    const improvedTranslation = yield* Type.string
    currentTranslation = improvedTranslation
    iterations++
  }
  return {
    finalTranslation: currentTranslation,
    iterationsRequired: iterations,
  }
}
