import { openai } from "@ai-sdk/openai"
import { workers } from "../workers.js"
import { exec } from "liminal-ai"

exec(workers, {
  models: {
    default: openai("gpt-4o-mini"),
  },
  handler: console.log,
})
