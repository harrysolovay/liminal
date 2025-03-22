import { openai } from "@ai-sdk/openai"
import { parallel } from "../parallel.js"
import { exec } from "liminal-ai"

exec(parallel(await Bun.file(import.meta.url).text()), {
  models: {
    default: openai("gpt-4o-mini"),
  },
  handler: console.log,
})
