import { type } from "arktype"
import { Conversation, Inference, Model, SystemMessage } from "liminal"
import { OllamaLanguageModel } from "liminal-ollama"
import { Ollama } from "ollama"

Conversation(MarketingCopy())
  .models({
    default: OllamaLanguageModel(new Ollama(), "llama3.2:latest"),
  })
  .reduce(console.log)

function* MarketingCopy() {
  yield* SystemMessage(
    `Write persuasive marketing copy for: ${"Buffy The Vampire Slayer"}. Focus on benefits and emotional appeal.`,
  )
  yield* Model.language("default")
  yield "Please generate the first draft."
  let copy = yield* Inference()
  yield `
    Now evaluate this marketing copy for:

    1. Presence of call to action (true/false)
    2. Emotional appeal (1-10)
    3. Clarity (1-10)

    Copy to evaluate: ${copy}
  `
  const qualityMetrics = yield* Inference(
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
    copy = yield* Inference()
  }
  return { copy, qualityMetrics }
}
