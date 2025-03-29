import { openai } from "@ai-sdk/openai"
import { type } from "arktype"
import { Branches, Context, Generation, Model } from "liminal"
import { AILanguageModel } from "liminal-ai"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const code = await readFile(fileURLToPath(import.meta.url), "utf-8")

const LMH = type("'lower' | 'medium' | 'high'")

await Review(code).exec({
  models: {
    language: {
      default: AILanguageModel(openai("gpt-4o-mini")),
    },
  },
  handler: console.log,
})

function Review(code: string) {
  return Context(
    "Parallel",
    "You are a technical lead summarizing multiple code reviews. Review the supplied code.",
    function*() {
      yield* Model("default")
      yield code
      const reviews = yield* Branches({
        SecurityReview,
        PerformanceReview,
        MaintainabilityReview,
      })
      yield JSON.stringify(Object.values(reviews), null, 2)
      yield `You are a technical lead summarizing multiple code reviews.`
      const summary = yield* Generation()
      return { reviews, summary }
    },
  )
}

function SecurityReview() {
  return Context(
    "SecurityReview",
    "You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.",
    () =>
      Generation(
        type({
          type: "'security'",
          vulnerabilities: "string[]",
          riskLevel: LMH,
          suggestions: "string[]",
        }),
      ),
  )
}

function PerformanceReview() {
  return Context(
    "PerformanceReview",
    "You are an expert in code performance. Focus on identifying performance bottlenecks, memory leaks, and optimization opportunities.",
    () =>
      Generation(
        type({
          type: "'performance'",
          issues: "string[]",
          impact: LMH,
          optimizations: "string[]",
        }),
      ),
  )
}

function MaintainabilityReview() {
  return Context(
    "MaintainabilityReview",
    "You are an expert in code quality. Focus on code structure, readability, and adherence to best practices.",
    () =>
      Generation(
        type({
          type: "'maintainability'",
          concerns: "string[]",
          qualityScore: "1 <= number.integer <= 10",
          recommendations: "string[]",
        }),
      ),
  )
}
