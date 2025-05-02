import { L } from "liminal"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { gpt4oMini } from "./_common.ts"

const LMH = L.enum("lower", "medium", "high")

const result = await L.run(
  async function*() {
    yield* L.model(gpt4oMini)
    const code = await readFile(fileURLToPath(import.meta.url), "utf-8")
    yield* L.system`You are a technical lead summarizing multiple code reviews. Review the supplied code.`
    yield* L.user(code)
    const reviews = yield* L.all({
      security,
      performance,
      maintainability,
    })
    yield* L.user(JSON.stringify(Object.values(reviews), null, 2))
    yield* L.user`You are a technical lead summarizing multiple code reviews.`
    const summary = yield* L.assistant
    return { reviews, summary }
  },
  { handler: console.log },
)

console.log(result)

function* security() {
  yield* L
    .system`You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.`
  return yield* L.assistant(L.object({
    type: L.const("security"),
    vulnerabilities: L.array(L.string),
    riskLevel: LMH,
    suggestions: L.array(L.string),
  }))
}

function* performance() {
  yield* L
    .system`You are an expert in code performance. Focus on identifying performance bottlenecks, memory leaks, and optimization opportunities.`
  return yield* L.assistant(L.object({
    type: L.const("performance"),
    issues: L.array(L.string),
    impact: LMH,
    optimizations: L.array(L.string),
  }))
}

function* maintainability() {
  yield* L
    .system`You are an expert in code quality. Focus on code structure, readability, and adherence to best practices.`
  return yield* L.assistant(L.object({
    type: L.const("maintainability"),
    concerns: L.array(L.string),
    qualityScore: L.integer,
    recommendations: L.array(L.string),
  }))
}
