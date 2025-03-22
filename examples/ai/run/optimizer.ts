import { openai } from "@ai-sdk/openai"
import { optimizer } from "../optimizer.js"
import { exec } from "liminal-ai"

exec(optimizer("typescript", "I love you!"), {
  models: {
    default: openai("gpt-4o-mini"),
  },
  handler: console.log,
})
