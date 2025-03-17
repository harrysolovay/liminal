import { L, system } from "liminal"

export function* translateWithFeedback(text: string, targetLanguage: string) {
  yield* system`You are an expert literary translator.`
  yield `
    Translate this text to ${targetLanguage}, preserving tone and cultural nuances:

    ${text}
  `
  let currentTranslation = yield* L.string
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
    const evaluation = yield* L({
      qualityScore: L.integer`Min of 1, max of 10`,
      preservesTone: L.boolean,
      preservesNuance: L.boolean,
      culturallyAccurate: L.boolean,
      specificIssues: L.array(L.string),
      improvementSuggestions: L.array(L.string),
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
    const improvedTranslation = yield* L.string
    currentTranslation = improvedTranslation
    iterations++
  }
  return {
    finalTranslation: currentTranslation,
    iterationsRequired: iterations,
  }
}
