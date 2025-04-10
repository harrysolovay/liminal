import { openai } from "@ai-sdk/openai"
import { LiminalConfig } from "liminal"
import { AILanguageModel } from "liminal-ai"

export default {
  default: AILanguageModel(openai("gpt-4o-mini")),
  agents: "_agents",
} satisfies LiminalConfig
