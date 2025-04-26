import { L } from "liminal"
import "liminal-arktype/register"
import { type } from "arktype"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { gpt4oMini } from "./_models.ts"

const LMH = type("'lower' | 'medium' | 'high'")

const result = await L.strand(async function*() {
  yield* L.model(gpt4oMini)
  const code = await readFile(fileURLToPath(import.meta.url), "utf-8")
  yield* L.system`You are a technical lead summarizing multiple code reviews. Review the supplied code.`
  yield* L.user(code)
  const reviews = yield* L.strand({
    security,
    performance,
    maintainability,
  })
  yield* L.user(JSON.stringify(Object.values(reviews), null, 2))
  yield* L.user`You are a technical lead summarizing multiple code reviews.`
  const summary = yield* L.assistant
  return { reviews, summary }
}, { handler: console.log })

console.log(result)

function* security() {
  yield* L
    .system`You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.`
  return yield* L.assistant(type({
    type: "'security'",
    vulnerabilities: "string[]",
    riskLevel: LMH,
    suggestions: "string[]",
  }))
}

function* performance() {
  yield* L
    .system`You are an expert in code performance. Focus on identifying performance bottlenecks, memory leaks, and optimization opportunities.`
  return yield* L.assistant(type({
    type: "'performance'",
    issues: "string[]",
    impact: LMH,
    optimizations: "string[]",
  }))
}

function* maintainability() {
  yield* L
    .system`You are an expert in code quality. Focus on code structure, readability, and adherence to best practices.`
  return yield* L.assistant(type({
    type: "'maintainability'",
    concerns: "string[]",
    qualityScore: "number.integer",
    recommendations: "string[]",
  }))
}
