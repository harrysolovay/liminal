import { Branch, Value, Context, Exec } from "liminal"
import { type } from "arktype"
import { adapter } from "liminal-ai"
import { openai } from "@ai-sdk/openai"
import { fileURLToPath } from "node:url"

const code = await Bun.file(fileURLToPath(import.meta.url)).text()

Exec(adapter).run(Review(code), {
  models: {
    language: {
      default: openai("gpt-4o-mini"),
    },
    embedding: {},
  },
  handler: console.log,
})

function Review(code: string) {
  return Context(
    "Parallel",
    "You are a technical lead summarizing multiple code reviews. Review the supplied code.",
    function* () {
      yield code
      const reviews = yield* Branch({ securityReview, performanceReview, maintainabilityReview })
      yield JSON.stringify(Object.values(reviews), null, 2)
      yield `You are a technical lead summarizing multiple code reviews.`
      const summary = yield* Value()
      return { reviews, summary }
    },
  )
}

const LMH = type("'lower' | 'medium' | 'high'")

const securityReview = Context(
  "SecurityReview",
  "You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.",
  () =>
    Value(
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
    Value(
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
    Value(
      type({
        type: "'maintainability'",
        concerns: "string[]",
        qualityScore: "1 <= number.integer <= 10",
        recommendations: "string[]",
      }),
    ),
)
