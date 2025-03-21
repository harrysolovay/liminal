import { openai } from "@ai-sdk/openai"
import { Routing } from "../routing.js"

Routing("")
  .run({
    models: {
      default: openai("gpt-4o-mini"),
      reasoning: openai("o1-mini"),
    },
  })
  .then(console.log)
