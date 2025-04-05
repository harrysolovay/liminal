import { openai } from "@ai-sdk/openai"
import type { LiminalConfig } from "liminal"
import { AILanguageModel } from "liminal-ai"

export default {
  actors: "examples/actors",
  print: true,
  bind: {
    default: AILanguageModel(openai("gpt-4o-mini", {
      structuredOutputs: true,
    })),
    reasoning: AILanguageModel(openai("o1-mini")),
    arbiter: AILanguageModel(openai("gpt-4o-mini")),
    one: AILanguageModel(openai("gpt-4o-mini")),
    two: AILanguageModel(openai("gpt-4o-mini")),
    three: AILanguageModel(openai("gpt-4o-mini")),
  },
} satisfies LiminalConfig
