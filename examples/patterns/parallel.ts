import { openai } from "@ai-sdk/openai"
import { exec, L } from "liminal"
import { AILanguageModel } from "liminal-ai"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const code = await readFile(fileURLToPath(import.meta.url), "utf-8")

const LMH = L.enum("lower", "medium", "high")

exec(review(code), {
  bind: { default: AILanguageModel(openai("gpt-4o-mini")) },
  handler: console.log,
})

function* review(code: string) {
  yield* L.declareLanguageModel("default")
  yield* L.system`You are a technical lead summarizing multiple code reviews. Review the supplied code.`
  yield* L.user(code)
  const reviews = L.fork("reviews", { security, performance, maintainability })
  yield* L.user(JSON.stringify(Object.values(reviews), null, 2))
  yield* L.user`You are a technical lead summarizing multiple code reviews.`
  const summary = yield* L.infer()
  return { reviews, summary }
}

function* security() {
  yield* L
    .system`You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.`
  return yield* L.object({
    type: "security",
    vulnerabilities: L.array(L.string),
    riskLevel: LMH,
    suggestions: L.array(L.string),
  })
}

function* performance() {
  yield* L
    .system`You are an expert in code performance. Focus on identifying performance bottlenecks, memory leaks, and optimization opportunities.`
  return yield* L.object({
    type: "performance",
    issues: L.array(L.string),
    impact: LMH,
    optimizations: L.array(L.string),
  })
}

function* maintainability() {
  yield* L
    .system`You are an expert in code quality. Focus on code structure, readability, and adherence to best practices.`
  return yield* L.object({
    type: "maintainability",
    concerns: L.array(L.string),
    qualityScore: L.integer`Between 1 and 10, inclusive.`,
    recommendations: "string[]",
  })
}
