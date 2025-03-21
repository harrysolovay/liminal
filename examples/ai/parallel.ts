import { Branch, AssistantValue, AssistantText, Agent } from "liminal"
import { type } from "arktype"

function ParallelAgent(code: string) {
  return Agent(
    "",
    "You are a technical lead summarizing multiple code reviews. Review the supplied code.",
    function* () {
      yield "The code:"
      yield code

      const reviews = yield* Branch({
        security: SecurityReviewAgent,
        performance: PerformanceReviewAgent,
        maintainability: MaintainabilityReviewAgent,
      })

      yield JSON.stringify(Object.values(reviews), null, 2)

      yield `You are a technical lead summarizing multiple code reviews.`

      const summary = yield* AssistantText()

      return { reviews, summary }
    },
  )
}

const LMH = type("'lower' | 'medium' | 'high'")

function SecurityReviewAgent() {
  return Agent(
    "",
    "You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.",
    () =>
      AssistantValue(
        type({
          type: "'security'",
          vulnerabilities: "string[]",
          riskLevel: LMH,
          suggestions: "string[]",
        }),
      ),
  )
}

function PerformanceReviewAgent() {
  return Agent(
    "",
    "You are an expert in code performance. Focus on identifying performance bottlenecks, memory leaks, and optimization opportunities.",
    () =>
      AssistantValue(
        type({
          type: "'performance'",
          issues: "string[]",
          impact: LMH,
          optimizations: "string[]",
        }),
      ),
  )
}

function MaintainabilityReviewAgent() {
  return Agent(
    "",
    "You are an expert in code quality. Focus on code structure, readability, and adherence to best practices.",
    () =>
      AssistantValue(
        type({
          type: "'maintainability'",
          concerns: "string[]",
          qualityScore: "1 <= number.integer <= 10",
          recommendations: "string[]",
        }),
      ),
  )
}
