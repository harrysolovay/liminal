import { L } from "liminal"
import { gpt4oMini } from "./_common.ts"

await L.run(function*() {
  yield* L.focus(gpt4oMini)
  yield* L
    .system`Write persuasive marketing copy for: Buffy The Vampire Slayer. Focus on benefits and emotional appeal.`
  yield* L.user`Please generate the first draft.`
  let copy = yield* L.assistant
  yield* L.user`
    Now evaluate this marketing copy for:

    1. Presence of call to action (true/false)
    2. Emotional appeal (1-10)
    3. Clarity (1-10)

    Copy to evaluate: ${copy}
  `
  const qualityMetrics = yield* L.assistant(L.object({
    hasCallToAction: L.boolean,
    emotionalAppeal: L.number,
    clarity: L.number,
  }))
  if (!qualityMetrics.hasCallToAction || qualityMetrics.emotionalAppeal < 7 || qualityMetrics.clarity < 7) {
    yield* L.user`
      Rewrite this marketing copy with:

      ${!qualityMetrics.hasCallToAction ? "- A clear call to action" : ""}
      ${qualityMetrics.emotionalAppeal < 7 ? "- Stronger emotional appeal" : ""}
      ${qualityMetrics.clarity < 7 ? "- Improved clarity and directness" : ""}

      Original copy: ${copy}
    `
    copy = yield* L.assistant
  }
  return { copy, qualityMetrics }
}, { handler: console.log })
