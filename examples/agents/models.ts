import { openai } from "@ai-sdk/openai"
import { ai } from "liminal-ai"
import { ollama } from "liminal-ollama"

export default {
  gpt4o: ai(openai("gpt-4o-mini", {
    structuredOutputs: true,
  })),
  gpt4oMini: ai(openai("gpt-4o-mini", {
    structuredOutputs: true,
  })),
  o1Mini: ai(openai("o1-mini")),
  gemma3: ollama("gemma3:1b"),
  mistralSmall31: ollama("mistral-small3.1"),
}
