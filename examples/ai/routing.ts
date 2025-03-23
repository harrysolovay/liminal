import { Agent, Assistant, Model } from "liminal"
import { type } from "arktype"
import { AIExec } from "liminal-ai"
import { openai } from "@ai-sdk/openai"

AIExec(routing(), {
  models: {
    default: openai("gpt-4o-mini"),
    reasoning: openai("o1-mini"),
  },
}).run(console.log)

function* routing() {
  const query = prompt("Please enter your query?")!
  const classification = yield* classifyQuery(query)
  const response = yield* useClassification(classification)
  return { classification, response }
}

function classifyQuery(query: string) {
  return Agent(
    "ClassifyQueryAgent",
    `
      Classify this supplied customer query:

      Determine:

      1. Query type (general, refund, or technical)
      2. Complexity (simple or complex)
      3. Brief reasoning for classification
    `,
    function* () {
      yield query
      return yield* Assistant(Classification)
    },
  )
}

const Classification = type({
  reasoning: "string",
  type: "'general' | 'refund' | 'technical'",
  complexity: "'simple' | 'complex'",
})

function useClassification(classification: typeof Classification.infer) {
  return Agent("UseClassificationAgent", USE_CLASSIFICATION_AGENT_PROMPTS[classification.type], function* () {
    if (classification.complexity === "complex") {
      yield* Model("reasoning")
    }
    return yield* Assistant()
  })
}

const USE_CLASSIFICATION_AGENT_PROMPTS = {
  general: "You are an expert customer service agent handling general inquiries.",
  refund:
    "You are a customer service agent specializing in refund requests. Follow company policy and collect necessary information.",
  technical:
    "You are a technical support specialist with deep product knowledge. Focus on clear step-by-step troubleshooting.",
}
