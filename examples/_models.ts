import { openai } from "@ai-sdk/openai"
import { Model } from "liminal"
import { adapter as aiAdapter } from "liminal-ai"
import { adapter as ollamaAdapter } from "liminal-ollama"

export const gpt4o: Model = aiAdapter(openai("gpt-4o-mini", { structuredOutputs: true }))
export const gpt4oMini: Model = aiAdapter(openai("gpt-4o-mini", { structuredOutputs: true }))
export const o1Mini: Model = aiAdapter(openai("o1-mini"))
export const gemma3: Model = ollamaAdapter("gemma3:1b")
export const mistralSmall31: Model = ollamaAdapter("mistral-small3.1")
