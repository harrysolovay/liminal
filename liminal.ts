import { openai } from "@ai-sdk/openai"
import type { LiminalConfig } from "liminal"
import { AILanguageModel } from "liminal-ai"
import { OllamaLanguageModel } from "liminal-ollama"
import { Ollama } from "ollama"

const ollama = new Ollama()

export default {
  agents: "examples/agents",
  default: AILanguageModel(openai("gpt-4o-mini", {
    structuredOutputs: true,
  })),
  args: {
    reasoning: AILanguageModel(openai("o1-mini")),
    arbiter: AILanguageModel(openai("gpt-4o-mini")),
    one: AILanguageModel(openai("gpt-4o-mini")),
    two: AILanguageModel(openai("gpt-4o-mini")),
    three: AILanguageModel(openai("gpt-4o-mini")),
    gemma3: OllamaLanguageModel(ollama, "gemma3:1b"),
    "mistral-small3.1": OllamaLanguageModel(ollama, "mistral-small3.1"),
  },
  write: true,
} satisfies LiminalConfig
