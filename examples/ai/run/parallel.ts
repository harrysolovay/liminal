import { openai } from "@ai-sdk/openai"
import { Parallel } from "../parallel.js"

Parallel(await Bun.file(import.meta.url).text())("")
  .run({
    models: {
      default: openai("gpt-4o-mini"),
    },
    handler(event) {
      console.log(event)
    },
  })
  .then(console.log)
