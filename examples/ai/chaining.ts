import { from } from "liminal-arktype"
import { type } from "arktype"

export function* generateMarketingCopy(input: string) {
  yield `Write persuasive marketing copy for: ${input}. Focus on benefits and emotional appeal.`
  let copy = yield* from(type.string)
  yield `
    Evaluate this marketing copy for:

    1. Presence of call to action (true/false)
    2. Emotional appeal (1-10)
    3. Clarity (1-10)

    Copy to evaluate: ${copy}
  `
  const qualityMetrics = yield* from(
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
    copy = yield* from(type.string)
  }
  return { copy, qualityMetrics }
}
