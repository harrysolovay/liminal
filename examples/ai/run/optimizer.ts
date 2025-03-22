import { openai } from "@ai-sdk/openai"
import { optimizer } from "../optimizer.js"
import { AIExec } from "liminal-ai"

AIExec.exec(optimizer("typescript", "I love you!"), {
  models: {
    default: openai("gpt-4o-mini"),
  },
}).then(console.log)
