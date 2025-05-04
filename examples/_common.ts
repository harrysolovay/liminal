import { openai } from "@ai-sdk/openai"
import { Adapter, LEvent } from "liminal"
import { adapter as aiAdapter } from "liminal-ai"
import { adapter as ollamaAdapter } from "liminal-ollama"

export const gpt4o: Adapter = aiAdapter(openai("gpt-4o-mini", { structuredOutputs: true }))
export const gpt4oMini: Adapter = aiAdapter(openai("gpt-4o-mini", { structuredOutputs: true }))
export const o1Mini: Adapter = aiAdapter(openai("o1-mini"))
export const gemma3: Adapter = ollamaAdapter("gemma3:1b")
export const mistralSmall31: Adapter = ollamaAdapter("mistral-small3.1")

export function handler(event: any) {
  if (LEvent.is(event)) {
    if (event.type === "message_appended") {
      const { message: { role, parts } } = event
      console.log(`\x1b[2m${role}\x1b[0m`)
      console.log(parts[0]!.part)
      console.log("\n")
    }
  }
}
