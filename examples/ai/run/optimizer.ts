import { openai } from "@ai-sdk/openai"
import { TranslateWithFeedbackAgent } from "../optimizer.js"

TranslateWithFeedbackAgent(
  "typescript",
  "I love you!",
)("")
  .run({
    models: {
      default: openai("gpt-4o-mini"),
    },
  })
  .then(console.log)
