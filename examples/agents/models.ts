import { openai } from "@ai-sdk/openai"
import { ai } from "liminal-ai"
import { ollama } from "liminal-ollama"

export const gpt4o = ai(openai("gpt-4o-mini", {
  structuredOutputs: true,
}))
export const gpt4oMini = ai(openai("gpt-4o-mini", {
  structuredOutputs: true,
}))
export const o1Mini = ai(openai("o1-mini"))
export const gemma3 = ollama("gemma3:1b")
export const mistralSmall31 = ollama("mistral-small3.1")
