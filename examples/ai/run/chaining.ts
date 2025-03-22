import { openai } from "@ai-sdk/openai"
import { AIExec } from "liminal-ai"
import { chaining } from "../chaining.js"

AIExec.exec(chaining(prompt("Please enter the subject.")!), {
  models: {
    default: openai("gpt-4o-mini"),
  },
}).then(console.log)
