import { openai } from "@ai-sdk/openai"
import { type } from "arktype"
import * as L from "liminal"
import { AILanguageModel } from "liminal-ai"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const code = await readFile(fileURLToPath(import.meta.url), "utf-8")

const LMH = type("'lower' | 'medium' | 'high'")

L.exec(Review(code), {
  bind: {
    default: AILanguageModel(openai("gpt-4o-mini")),
  },
  handler: console.log,
})

function* Review(code: string) {
  yield* L.declareLanguageModel("default")
  yield* L.system`You are a technical lead summarizing multiple code reviews. Review the supplied code.`
  yield* L.user(code)
  const reviews = yield* L.fork("Reviews", {
    SecurityReview,
    PerformanceReview,
    MaintainabilityReview,
  })
  yield* L.user(JSON.stringify(Object.values(reviews), null, 2))
  yield* L.user`You are a technical lead summarizing multiple code reviews.`
  const summary = yield* L.infer()
  return { reviews, summary }
}

function* SecurityReview() {
  yield* L
    .system`You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.`
  return yield* L.infer(type({
    type: "'security'",
    vulnerabilities: "string[]",
    riskLevel: LMH,
    suggestions: "string[]",
  }))
}

function* PerformanceReview() {
  yield* L
    .system`You are an expert in code performance. Focus on identifying performance bottlenecks, memory leaks, and optimization opportunities.`
  return yield* L.infer(type({
    type: "'performance'",
    issues: "string[]",
    impact: LMH,
    optimizations: "string[]",
  }))
}

function* MaintainabilityReview() {
  yield* L
    .system`You are an expert in code quality. Focus on code structure, readability, and adherence to best practices.`
  return yield* L.infer(type({
    type: "'maintainability'",
    concerns: "string[]",
    qualityScore: "1 <= number.integer <= 10",
    recommendations: "string[]",
  }))
}
