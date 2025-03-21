import { openai } from "@ai-sdk/openai"
import { Chaining } from "../chaining.js"

Chaining()
  .run({
    models: {
      default: openai("gpt-4o-mini"),
    },
  })
  .then(console.log)
