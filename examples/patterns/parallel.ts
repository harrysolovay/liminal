import { openai } from "@ai-sdk/openai"
import { type } from "arktype"
import { apply, declareLanguageModel, fork, infer, system, user } from "liminal"
import { AILanguageModel } from "liminal-ai"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const code = await readFile(fileURLToPath(import.meta.url), "utf-8")

const LMH = type("'lower' | 'medium' | 'high'")

apply(Review(code), {
  default: AILanguageModel(openai("gpt-4o-mini")),
}).exec(console.log)

function* Review(code: string) {
  yield* declareLanguageModel("default")
  yield* system`You are a technical lead summarizing multiple code reviews. Review the supplied code.`
  yield* user(code)
  const reviews = yield* fork("Reviews", {
    SecurityReview,
    PerformanceReview,
    MaintainabilityReview,
  })
  yield* user(JSON.stringify(Object.values(reviews), null, 2))
  yield* user`You are a technical lead summarizing multiple code reviews.`
  const summary = yield* infer()
  return { reviews, summary }
}

function* SecurityReview() {
  yield* system`You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.`
  return yield* infer(type({
    type: "'security'",
    vulnerabilities: "string[]",
    riskLevel: LMH,
    suggestions: "string[]",
  }))
}

function* PerformanceReview() {
  yield* system`You are an expert in code performance. Focus on identifying performance bottlenecks, memory leaks, and optimization opportunities.`
  return yield* infer(type({
    type: "'performance'",
    issues: "string[]",
    impact: LMH,
    optimizations: "string[]",
  }))
}

function* MaintainabilityReview() {
  yield* system`You are an expert in code quality. Focus on code structure, readability, and adherence to best practices.`
  return yield* infer(type({
    type: "'maintainability'",
    concerns: "string[]",
    qualityScore: "1 <= number.integer <= 10",
    recommendations: "string[]",
  }))
}
