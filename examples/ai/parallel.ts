import { branch, L, system } from "liminal"

export function* parallelCodeReview(code: string) {
  yield system`You are a technical lead summarizing multiple code reviews.`

  const common = `Review this code: ${code}`

  const reviews = yield* branch({
    *securityReview() {
      yield* system`You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.`
      yield common
      return yield* L({
        type: "security",
        vulnerabilities: L.array(L.string),
        riskLevel: L.enum("lower", "medium", "high"),
        suggestions: L.array(L.string),
      })
    },
    *performanceReview() {
      yield* system`You are an expert in code performance. Focus on identifying performance bottlenecks, memory leaks, and optimization opportunities.`
      yield common
      return yield* L({
        type: "performance",
        issues: L.array(L.string),
        impact: L.enum("low", "medium", "high"),
        optimizations: L.array(L.string),
      })
    },
    *maintainabilityReview() {
      yield* system`You are an expert in code quality. Focus on code structure, readability, and adherence to best practices.`
      yield common
      return yield* L({
        type: "maintainability",
        concerns: L.array(L.string),
        qualityScore: L.integer()`Min 1, max 10.`,
        recommendations: L.array(L.string),
      })
    },
  })
  yield JSON.stringify(Object.values(reviews), null, 2)

  yield `You are a technical lead summarizing multiple code reviews.`
  const summary = yield* L.string

  return { reviews, summary }
}
