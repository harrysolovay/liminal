import { AssistantText, AssistantValue, Agent, iter } from "liminal"
import { type } from "arktype"

function MarketingCopyAgent(input: string) {
  return Agent(
    "MarketingCopy",
    `Write persuasive marketing copy for: ${input}. Focus on benefits and emotional appeal:`,
    function* () {
      let copy = yield* AssistantText()
      yield `
        Evaluate this marketing copy for:

        1. Presence of call to action (true/false)
        2. Emotional appeal (1-10)
        3. Clarity (1-10)

        Copy to evaluate: ${copy}
      `
      const qualityMetrics = yield* AssistantValue(
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
        copy = yield* AssistantText()
      }
      return { copy, qualityMetrics }
    },
  )
}

const y = iter(MarketingCopyAgent("blah blah blah"))
let z = await y.next()
console.log(z.value)
while (!z.done) {
  z = await y.next()
  console.log(z.value)
}
