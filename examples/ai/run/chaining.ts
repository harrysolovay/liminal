import { openai } from "@ai-sdk/openai"
import { chaining } from "../chaining.js"

chaining("MarketingCopy")
  .run({
    models: {
      default: openai("gpt-4o-mini"),
    },
  })
  .then(console.log)
