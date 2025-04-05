import { openai } from "@ai-sdk/openai"
import type { LiminalConfig } from "liminal"
import { AILanguageModel } from "liminal-ai"

export default {
  actorsDir: "examples/actors",
  exec: {
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
    handler: console.log,
  },
} satisfies LiminalConfig
