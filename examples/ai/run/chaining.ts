import { openai } from "@ai-sdk/openai"
import { exec } from "liminal-ai"
import { chaining } from "../chaining.js"

exec(chaining(prompt("Please enter the subject.")!), {
  models: {
    default: openai("gpt-4o-mini"),
  },
  handler: console.log,
})
