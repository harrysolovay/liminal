// import { branch, system, complete } from "liminal"
// import { type } from "arktype"

// const LMH = type("'lower' | 'medium' | 'high'")

// export function* parallelCodeReview(code: string) {
//   yield system`You are a technical lead summarizing multiple code reviews.`

//   const common = `Review this code: ${code}`

//   const reviews = yield* branch({
//     *securityReview() {
//       yield* system`You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.`
//       yield common
//       return yield* complete(
//         type({
//           type: "'security'",
//           vulnerabilities: "string[]",
//           riskLevel: LMH,
//           suggestions: "string[]",
//         }),
//       )
//     },
//     *performanceReview() {
//       yield* system`You are an expert in code performance. Focus on identifying performance bottlenecks, memory leaks, and optimization opportunities.`
//       yield common
//       return yield* complete(
//         type({
//           type: "'performance'",
//           issues: "string[]",
//           impact: LMH,
//           optimizations: "string[]",
//         }),
//       )
//     },
//     *maintainabilityReview() {
//       yield* system`You are an expert in code quality. Focus on code structure, readability, and adherence to best practices.`
//       yield common
//       return yield* complete(
//         type({
//           type: "'maintainability'",
//           concerns: "string[]",
//           qualityScore: "1 <= number.integer <= 10",
//           recommendations: "string[]",
//         }),
//       )
//     },
//   })
//   yield JSON.stringify(Object.values(reviews), null, 2)

//   yield `You are a technical lead summarizing multiple code reviews.`
//   const summary = yield* complete(type.string)

//   return { reviews, summary }
// }
