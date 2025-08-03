import { FileSystem, Path } from "@effect/platform"
import { BunContext } from "@effect/platform-bun"
import { Effect, Schema } from "effect"
import { L } from "liminal"
import { model } from "./_layers.ts"

const Lmh = Schema.Literal("lower", "medium", "high")

const security = L.branch(
  L.system`
    You are an expert in code security. Focus on identifying security
    vulnerabilities, injection risks, and authentication issues.
  `,
  L.assistantStruct({
    type: Schema.Literal("security"),
    vulnerabilities: Schema.Array(Schema.String),
    riskLevel: Lmh,
    suggestions: Schema.Array(Schema.String),
  }),
)

const performance = L.branch(
  L.system`
    You are an expert in code performance. Focus on identifying performance
    bottlenecks, memory leaks, and optimization opportunities.
  `,
  L.assistantStruct({
    type: Schema.Literal("performance"),
    issues: Schema.Array(Schema.String),
    impact: Lmh,
    optimizations: Schema.Array(Schema.String),
  }),
)

const maintainability = L.branch(
  L.system`
    You are an expert in code quality. Focus on code structure,
    readability, and adherence to best practices.
  `,
  L.assistantStruct({
    type: Schema.Literal("maintainability"),
    concerns: Schema.Array(Schema.String),
    qualityScore: Schema.Int,
    recommendations: Schema.Array(Schema.String),
  }),
)

Effect.gen(function*() {
  const path = yield* Path.Path
  const fs = yield* FileSystem.FileSystem

  const code = yield* path.fromFileUrl(new URL(import.meta.url)).pipe(
    Effect.flatMap(fs.readFileString),
  )

  const reviews = yield* L.strand(
    L.system`
      You are a technical lead summarizing multiple code reviews. Review the supplied code.
    `,
    L.user(code),
    Effect.all({ security, performance, maintainability }, {
      concurrency: "unbounded",
    }),
  )

  const summary = yield* L.strand(
    L.system`You are a technical lead summarizing multiple code reviews.`,
    L.user`Please summarize the following code reviews.`,
    L.userJson(reviews),
    L.assistant,
  )

  return { reviews, summary }
}).pipe(
  Effect.provide([BunContext.layer, model]),
  Effect.runPromise,
).then(console.log)
