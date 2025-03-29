import { Generation, Context, Model } from "liminal"
import { type } from "arktype"
import { AILanguageModel } from "liminal-ai"
import { openai } from "@ai-sdk/openai"

await MarketingCopy().exec({
  models: {
    language: {
      default: AILanguageModel(openai("gpt-4o-mini")),
    },
  },
  handler: console.log,
})

export function MarketingCopy() {
  return Context(
    "MarketingCopy",
    `Write persuasive marketing copy for: ${"Buffy The Vampire Slayer"}. Focus on benefits and emotional appeal.`,
    function* () {
      yield* Model("default")
      yield "Please generate the first draft."
      let copy = yield* Generation()
      yield `
        Now evaluate this marketing copy for:

        1. Presence of call to action (true/false)
        2. Emotional appeal (1-10)
        3. Clarity (1-10)

        Copy to evaluate: ${copy}
      `
      const qualityMetrics = yield* Generation(
        type({
          hasCallToAction: "boolean",
          emotionalAppeal: "number.integer",
          clarity: "number.integer",
        }),
      )
      if (!qualityMetrics.hasCallToAction || qualityMetrics.emotionalAppeal < 7 || qualityMetrics.clarity < 7) {
        yield `
          Rewrite this marketing copy with:

          ${!qualityMetrics.hasCallToAction ? "- A clear call to action" : ""}
          ${qualityMetrics.emotionalAppeal < 7 ? "- Stronger emotional appeal" : ""}
          ${qualityMetrics.clarity < 7 ? "- Improved clarity and directness" : ""}

          Original copy: ${copy}
        `
        copy = yield* Generation()
      }
      return { copy, qualityMetrics }
    },
  )
}
