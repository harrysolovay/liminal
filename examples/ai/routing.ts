import { Context, Generation, Model, Exec, Scope } from "liminal"
import { type } from "arktype"
import { adapter } from "liminal-ai"
import { openai } from "@ai-sdk/openai"

Exec(adapter).run(
  function* () {
    const classification = yield* classifyQuery("I'd like a refund please")
    const response = yield* useClassification(classification)
    return { classification, response }
  },
  {
    models: {
      language: {
        default: openai("gpt-4o-mini"),
        reasoning: openai("o1-mini"),
      },
      embedding: {},
    },
    handler: console.log,
  },
)

function classifyQuery(query: string) {
  return Scope(
    "ClassifyQueryAgent",
    Context(
      `
      Classify this supplied customer query:

      Determine:

      1. Query type (general, refund, or technical)
      2. Complexity (simple or complex)
      3. Brief reasoning for classification
    `,
      function* () {
        yield query
        return yield* Generation(Classification)
      },
    ),
  )
}

const Classification = type({
  reasoning: "string",
  type: "'general' | 'refund' | 'technical'",
  complexity: "'simple' | 'complex'",
})

function useClassification(classification: typeof Classification.infer) {
  return Scope(
    "UseClassificationAgent",
    Context(USE_CLASSIFICATION_AGENT_PROMPTS[classification.type], function* () {
      if (classification.complexity === "complex") {
        yield* Model.language("reasoning")
      }
      return yield* Generation()
    }),
  )
}

const USE_CLASSIFICATION_AGENT_PROMPTS = {
  general: "You are an expert customer service agent handling general inquiries.",
  refund:
    "You are a customer service agent specializing in refund requests. Follow company policy and collect necessary information.",
  technical:
    "You are a technical support specialist with deep product knowledge. Focus on clear step-by-step troubleshooting.",
}
