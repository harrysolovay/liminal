import { L } from "liminal"

export function* generateMarketingCopy(input: string) {
  yield `Write persuasive marketing copy for: ${input}. Focus on benefits and emotional appeal.`
  let copy = yield* L.string
  yield `
    Evaluate this marketing copy for:

    1. Presence of call to action (true/false)
    2. Emotional appeal (1-10)
    3. Clarity (1-10)

    Copy to evaluate: ${copy}
  `
  const qualityMetrics = yield* L({
    hasCallToAction: L.boolean,
    emotionalAppeal: L.integer,
    clarity: L.integer,
  })
  if (!qualityMetrics.hasCallToAction || qualityMetrics.emotionalAppeal < 7 || qualityMetrics.clarity < 7) {
    yield `
      Rewrite this marketing copy with:

      ${!qualityMetrics.hasCallToAction ? "- A clear call to action" : ""}
      ${qualityMetrics.emotionalAppeal < 7 ? "- Stronger emotional appeal" : ""}
      ${qualityMetrics.clarity < 7 ? "- Improved clarity and directness" : ""}

      Original copy: ${copy}
    `
    copy = yield* L.string
  }
  return { copy, qualityMetrics }
}
