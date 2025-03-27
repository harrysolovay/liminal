import { Branch, Generation, Context, run, LanguageModel } from "liminal"
import { type } from "arktype"
import { LM } from "liminal-ai"
import { openai } from "@ai-sdk/openai"
import { fileURLToPath } from "node:url"
import { readFile } from "node:fs/promises"

const code = await readFile(fileURLToPath(import.meta.url), "utf-8")

run(Review(code), {
  models: {
    language: {
      default: LM(openai("gpt-4o-mini")),
    },
  },
  handler: console.log,
})

function Review(code: string) {
  return Context(
    "Parallel",
    "You are a technical lead summarizing multiple code reviews. Review the supplied code.",
    function* () {
      yield* LanguageModel("default")
      yield code
      const reviews = yield* Branch({ securityReview, performanceReview, maintainabilityReview })
      yield JSON.stringify(Object.values(reviews), null, 2)
      yield `You are a technical lead summarizing multiple code reviews.`
      const summary = yield* Generation()
      return { reviews, summary }
    },
  )
}

const LMH = type("'lower' | 'medium' | 'high'")

const securityReview = Context(
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

const performanceReview = Context(
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

const maintainabilityReview = Context(
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
