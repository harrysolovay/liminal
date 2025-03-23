import { Branch, Assistant, Agent } from "liminal"
import { type } from "arktype"
import { AIExec } from "liminal-ai"
import { openai } from "@ai-sdk/openai"
import { fileURLToPath } from "node:url"

AIExec(parallel(await Bun.file(fileURLToPath(import.meta.url)).text()), {
  models: {
    default: openai("gpt-4o-mini"),
  },
}).run(console.log)

function parallel(code: string) {
  return Agent(
    "Parallel",
    "You are a technical lead summarizing multiple code reviews. Review the supplied code.",
    function* () {
      yield code
      const reviews = yield* Branch({ securityReview, performanceReview, maintainabilityReview })
      yield JSON.stringify(Object.values(reviews), null, 2)
      yield `You are a technical lead summarizing multiple code reviews.`
      const summary = yield* Assistant()
      return { reviews, summary }
    },
  )
}

const LMH = type("'lower' | 'medium' | 'high'")

const securityReview = Agent(
  "SecurityReview",
  "You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.",
  () =>
    Assistant(
      type({
        type: "'security'",
        vulnerabilities: "string[]",
        riskLevel: LMH,
        suggestions: "string[]",
      }),
    ),
)

const performanceReview = Agent(
  "PerformanceReview",
  "You are an expert in code performance. Focus on identifying performance bottlenecks, memory leaks, and optimization opportunities.",
  () =>
    Assistant(
      type({
        type: "'performance'",
        issues: "string[]",
        impact: LMH,
        optimizations: "string[]",
      }),
    ),
)

const maintainabilityReview = Agent(
  "MaintainabilityReview",
  "You are an expert in code quality. Focus on code structure, readability, and adherence to best practices.",
  () =>
    Assistant(
      type({
        type: "'maintainability'",
        concerns: "string[]",
        qualityScore: "1 <= number.integer <= 10",
        recommendations: "string[]",
      }),
    ),
)
