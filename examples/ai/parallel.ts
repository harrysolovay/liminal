import { Branch, AssistantObject, AssistantText, Agent } from "liminal"
import { type } from "arktype"

export function Parallel(code: string) {
  return Agent("You are a technical lead summarizing multiple code reviews. Review the supplied code.", function* () {
    yield code

    const reviews = yield* Branch({
      security: SecurityReview,
      performance: PerformanceReview,
      maintainability: MaintainabilityReview,
    })

    yield JSON.stringify(Object.values(reviews), null, 2)

    yield `You are a technical lead summarizing multiple code reviews.`

    const summary = yield* AssistantText()

    return { reviews, summary }
  })
}

export function SecurityReview() {
  return Agent(
    "You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.",
    AssistantObject(
      type({
        type: "'security'",
        vulnerabilities: "string[]",
        riskLevel: LMH,
        suggestions: "string[]",
      }),
    ),
  )
}

export function PerformanceReview() {
  return Agent(
    "You are an expert in code performance. Focus on identifying performance bottlenecks, memory leaks, and optimization opportunities.",
    AssistantObject(
      type({
        type: "'performance'",
        issues: "string[]",
        impact: LMH,
        optimizations: "string[]",
      }),
    ),
  )
}

export function MaintainabilityReview() {
  return Agent(
    "You are an expert in code quality. Focus on code structure, readability, and adherence to best practices.",
    AssistantObject(
      type({
        type: "'maintainability'",
        concerns: "string[]",
        qualityScore: "1 <= number.integer <= 10",
        recommendations: "string[]",
      }),
    ),
  )
}

const LMH = type("'lower' | 'medium' | 'high'")
