import { branch, Type, system } from "liminal"

export function* parallelCodeReview(code: string) {
  yield system`You are a technical lead summarizing multiple code reviews.`

  const common = `Review this code: ${code}`

  const reviews = yield* branch({
    *securityReview() {
      yield* system`You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.`
      yield common
      return yield* Type({
        type: "security",
        vulnerabilities: Type.array(Type.string),
        riskLevel: Type.enum("lower", "medium", "high"),
        suggestions: Type.array(Type.string),
      })
    },
    *performanceReview() {
      yield* system`You are an expert in code performance. Focus on identifying performance bottlenecks, memory leaks, and optimization opportunities.`
      yield common
      return yield* Type({
        type: "performance",
        issues: Type.array(Type.string),
        impact: Type.enum("low", "medium", "high"),
        optimizations: Type.array(Type.string),
      })
    },
    *maintainabilityReview() {
      yield* system`You are an expert in code quality. Focus on code structure, readability, and adherence to best practices.`
      yield common
      return yield* Type({
        type: "maintainability",
        concerns: Type.array(Type.string),
        qualityScore: Type.integer()`Min 1, max 10.`,
        recommendations: Type.array(Type.string),
      })
    },
  })
  yield JSON.stringify(Object.values(reviews), null, 2)

  yield `You are a technical lead summarizing multiple code reviews.`
  const summary = yield* Type.string

  return { reviews, summary }
}
