import { L } from "liminal"
import { gpt4oMini } from "./_common.ts"

const LANGUAGE = "typescript"
const TEXT = "I love you!"

const result = await L.run(
  function*() {
    yield* L.focus(gpt4oMini)
    yield* L
      .system`You are an expert literary translator. Translate the supplied text to the specified target language, preserving tone and cultural nuances.`
    yield* L.user`Target language: ${LANGUAGE}`
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
      const evaluation = yield* L.assistant(L.object({
        qualityScore: L.integer,
        preservesTone: L.boolean,
        preservesNuance: L.boolean,
        culturallyAccurate: L.boolean,
        specificIssues: L.array(L.string),
        improvementSuggestions: L.array(L.string),
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
      currentTranslation = yield* L.assistant
      iterations += 1
    }
    return {
      finalTranslation: currentTranslation,
      iterationsRequired: iterations,
    }
  },
  { handler: console.log },
)

console.log(result)
