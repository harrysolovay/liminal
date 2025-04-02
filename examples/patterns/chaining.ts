import { openai } from "@ai-sdk/openai"
import { type } from "arktype"
import { apply, declareLanguageModel, infer, system, user } from "liminal"
import { AILanguageModel } from "liminal-ai"

apply(MarketingCopy, {
  default: AILanguageModel(openai("gpt-4o-mini")),
}).exec(console.log)

function* MarketingCopy() {
  yield* system`Write persuasive marketing copy for: Buffy The Vampire Slayer. Focus on benefits and emotional appeal.`
  yield* declareLanguageModel("default")
  yield* user`Please generate the first draft.`
  let copy = yield* infer()
  yield* user`
    Now evaluate this marketing copy for:

    1. Presence of call to action (true/false)
    2. Emotional appeal (1-10)
    3. Clarity (1-10)

    Copy to evaluate: ${copy}
  `
  const qualityMetrics = yield* infer(type({
    hasCallToAction: "boolean",
    emotionalAppeal: "number.integer",
    clarity: "number.integer",
  }))
  if (!qualityMetrics.hasCallToAction || qualityMetrics.emotionalAppeal < 7 || qualityMetrics.clarity < 7) {
    yield* user`
      Rewrite this marketing copy with:

      ${!qualityMetrics.hasCallToAction ? "- A clear call to action" : ""}
      ${qualityMetrics.emotionalAppeal < 7 ? "- Stronger emotional appeal" : ""}
      ${qualityMetrics.clarity < 7 ? "- Improved clarity and directness" : ""}

      Original copy: ${copy}
    `
    copy = yield* infer()
  }
  return { copy, qualityMetrics }
}
