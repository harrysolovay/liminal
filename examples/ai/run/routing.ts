import { openai } from "@ai-sdk/openai"
import { routing } from "../routing.js"
import { exec } from "liminal-ai"

exec(routing(), {
  models: {
    default: openai("gpt-4o-mini"),
    reasoning: openai("o1-mini"),
  },
  handler: console.log,
})
