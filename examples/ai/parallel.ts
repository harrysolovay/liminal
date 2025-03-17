import { all, L, system } from "liminal"

export function* parallelCodeReview2(code: string) {
  const [securityReview, performanceReview, maintainabilityReview] = yield* all(
    function* () {
      yield* system`You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.`
      yield* common()
      return yield* L({
        vulnerabilities: L.array(L.string),
        riskLevel: L.enum("lower", "medium", "high"),
        suggestions: L.array(L.string),
      })
    },
    function* () {
      yield* system`You are an expert in code performance. Focus on identifying performance bottlenecks, memory leaks, and optimization opportunities.`
      yield* common()
      return yield* L({
        issues: L.array(L.string),
        impact: L.enum("low", "medium", "high"),
        optimizations: L.array(L.string),
      })
    },
    function* () {
      yield* system`You are an expert in code quality. Focus on code structure, readability, and adherence to best practices.`
      yield* common()
      return yield* L({
        concerns: L.array(L.string),
        qualityScore: L.integer()`Min 1, max 10.`,
        recommendations: L.array(L.string),
      })
    },
  )
  const reviews = [
    { type: "security", ...securityReview },
    { type: "performance", ...performanceReview },
    { type: "maintainability", ...maintainabilityReview },
  ]

  yield system`You are a technical lead summarizing multiple code reviews.`
  yield `You are a technical lead summarizing multiple code reviews.`
  yield JSON.stringify(reviews, null, 2)
  const summary = yield* L.string

  return { reviews, summary }

  function* common() {
    yield `Review this code:`
    yield code
  }
}
