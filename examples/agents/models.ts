import { openai } from "@ai-sdk/openai"
import type { Model } from "liminal"
import { ai } from "liminal-ai"
import { ollama } from "liminal-ollama"

export const gpt4o: Model = ai(openai("gpt-4o-mini", {
  structuredOutputs: true,
}))
export const gpt4oMini: Model = ai(openai("gpt-4o-mini", {
  structuredOutputs: true,
}))
export const o1Mini: Model = ai(openai("o1-mini"))
export const gemma3: Model = ollama("gemma3:1b")
export const mistralSmall31: Model = ollama("mistral-small3.1")
