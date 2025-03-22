import { openai } from "@ai-sdk/openai"
import { parallel } from "../parallel.js"
import { AIExec } from "liminal-ai"

AIExec.exec(parallel(await Bun.file(import.meta.url).text()), {
  models: {
    default: openai("gpt-4o-mini"),
  },
  handler(event) {
    console.log(event)
  },
}).then(console.log)
