import { openai } from "@ai-sdk/openai"
import { workers } from "../workers.js"

workers("")
  .run({
    models: {
      default: openai("gpt-4o-mini"),
    },
  })
  .then(console.log)
