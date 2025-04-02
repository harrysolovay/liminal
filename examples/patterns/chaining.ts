import { openai } from "@ai-sdk/openai"
import { type } from "arktype"
import * as L from "liminal"
import { AILanguageModel } from "liminal-ai"

L.exec(MarketingCopy, {
  bind: {
    default: AILanguageModel(openai("gpt-4o-mini")),
  },
  handler: console.log,
})

function* MarketingCopy() {
  yield* L
    .system`Write persuasive marketing copy for: Buffy The Vampire Slayer. Focus on benefits and emotional appeal.`
  yield* L.declareLanguageModel("default")
  yield* L.user`Please generate the first draft.`
  let copy = yield* L.infer()
  yield* L.user`
    Now evaluate this marketing copy for:

    1. Presence of call to action (true/false)
    2. Emotional appeal (1-10)
    3. Clarity (1-10)

    Copy to evaluate: ${copy}
  `
  const qualityMetrics = yield* L.infer(type({
    hasCallToAction: "boolean",
    emotionalAppeal: "number.integer",
    clarity: "number.integer",
  }))
  if (!qualityMetrics.hasCallToAction || qualityMetrics.emotionalAppeal < 7 || qualityMetrics.clarity < 7) {
    yield* L.user`
      Rewrite this marketing copy with:

      ${!qualityMetrics.hasCallToAction ? "- A clear call to action" : ""}
      ${qualityMetrics.emotionalAppeal < 7 ? "- Stronger emotional appeal" : ""}
      ${qualityMetrics.clarity < 7 ? "- Improved clarity and directness" : ""}

      Original copy: ${copy}
    `
    copy = yield* L.infer()
  }
  return { copy, qualityMetrics }
}
