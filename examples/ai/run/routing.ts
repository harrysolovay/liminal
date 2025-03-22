import { openai } from "@ai-sdk/openai"
import { routing } from "../routing.js"
import { AIExec } from "liminal-ai"

AIExec.exec(routing(), {
  models: {
    default: openai("gpt-4o-mini"),
    reasoning: openai("o1-mini"),
  },
}).then(console.log)
