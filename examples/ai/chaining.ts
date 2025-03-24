import { Assistant, Context } from "liminal"
import { type } from "arktype"
import { AIExec } from "liminal-ai"
import { openai } from "@ai-sdk/openai"

AIExec(chaining(prompt("Please enter the subject:")!), {
  models: {
    default: openai("gpt-4o-mini"),
  },
}).run(console.log)

export function chaining(subject: string) {
  return Context(
    "chain",
    `Write persuasive marketing copy for: ${subject}. Focus on benefits and emotional appeal.`,
    function* () {
      let copy = yield* Assistant()
      yield `
        Evaluate this marketing copy for:

        1. Presence of call to action (true/false)
        2. Emotional appeal (1-10)
        3. Clarity (1-10)

        Copy to evaluate: ${copy}
      `
      const qualityMetrics = yield* Assistant(
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
        copy = yield* Assistant()
      }
      return { copy, qualityMetrics }
    },
  )
}
