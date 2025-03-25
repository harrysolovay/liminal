import { T, Context, Exec, Messages } from "liminal"
import { type } from "arktype"
import { adapter } from "liminal-ai"
import { openai } from "@ai-sdk/openai"

Exec(adapter).run(MarketingCopy, {
  models: {
    default: openai("gpt-4o-mini"),
  },
  handler: console.log,
})

export function MarketingCopy() {
  return Context(
    "MarketingCopy",
    `Write persuasive marketing copy for: ${"Buffy The Vampire Slayer"}. Focus on benefits and emotional appeal.`,
    function* () {
      yield "Please generate the first draft."
      let copy = yield* T()
      console.log({
        messages: yield* Messages(),
      })
      yield `
        Now evaluate this marketing copy for:

        1. Presence of call to action (true/false)
        2. Emotional appeal (1-10)
        3. Clarity (1-10)

        Copy to evaluate: ${copy}
      `
      const qualityMetrics = yield* T(
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
        copy = yield* T()
      }
      return { copy, qualityMetrics }
    },
  )
}
