import { openai } from "@ai-sdk/openai"
import { type } from "arktype"
import { Branches, Exec, Inference, Model, SystemMessage } from "liminal"
import { AILanguageModel } from "liminal-ai"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const code = await readFile(fileURLToPath(import.meta.url), "utf-8")

const LMH = type("'lower' | 'medium' | 'high'")

Exec(Review(code))
  .models({
    default: AILanguageModel(openai("gpt-4o-mini")),
  })
  .reduce(console.log)

function* Review(code: string) {
  yield* SystemMessage("You are a technical lead summarizing multiple code reviews. Review the supplied code.")
  yield* Model.language("default")
  yield code
  const reviews = yield* Branches("Reviews", {
    SecurityReview,
    PerformanceReview,
    MaintainabilityReview,
  })
  yield JSON.stringify(Object.values(reviews), null, 2)
  yield `You are a technical lead summarizing multiple code reviews.`
  const summary = yield* Inference()
  return { reviews, summary }
}

function* SecurityReview() {
  yield* SystemMessage(
    "You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.",
  )
  return yield* Inference(
    type({
      type: "'security'",
      vulnerabilities: "string[]",
      riskLevel: LMH,
      suggestions: "string[]",
    }),
  )
}

function* PerformanceReview() {
  yield* SystemMessage(
    "You are an expert in code performance. Focus on identifying performance bottlenecks, memory leaks, and optimization opportunities.",
  )
  return yield* Inference(
    type({
      type: "'performance'",
      issues: "string[]",
      impact: LMH,
      optimizations: "string[]",
    }),
  )
}

function* MaintainabilityReview() {
  yield* SystemMessage(
    "You are an expert in code quality. Focus on code structure, readability, and adherence to best practices.",
  )
  return yield* Inference(
    type({
      type: "'maintainability'",
      concerns: "string[]",
      qualityScore: "1 <= number.integer <= 10",
      recommendations: "string[]",
    }),
  )
}
