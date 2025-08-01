import { Path } from "@effect/platform"
import { BunPath } from "@effect/platform-bun"
import { Effect, Schema } from "effect"
import { L, Strand } from "liminal"
import { model } from "./_layers.ts"
import { logger } from "./_logger.ts"

const Lmh = Schema.Literal("lower", "medium", "high")

const security = L.assistantStruct({
  type: Schema.Literal("security"),
  vulnerabilities: Schema.Array(Schema.String),
  riskLevel: Lmh,
  suggestions: Schema.Array(Schema.String),
}).pipe(
  Effect.provide(
    Strand.clone`
      You are an expert in code security. Focus on identifying security
      vulnerabilities, injection risks, and authentication issues.
    `,
  ),
)

const performance = L.assistantStruct({
  type: Schema.Literal("performance"),
  issues: Schema.Array(Schema.String),
  impact: Lmh,
  optimizations: Schema.Array(Schema.String),
}).pipe(Effect.provide(
  Strand.clone`
    You are an expert in code performance. Focus on identifying performance
    bottlenecks, memory leaks, and optimization opportunities.
  `,
))

const maintainability = L.assistantStruct({
  type: Schema.Literal("maintainability"),
  concerns: Schema.Array(Schema.String),
  qualityScore: Schema.Int,
  recommendations: Schema.Array(Schema.String),
}).pipe(
  Effect.provide(
    Strand.clone`
      You are an expert in code quality. Focus on code structure,
      readability, and adherence to best practices.
    `,
  ),
)

Effect.gen(function*() {
  yield* logger

  const path = yield* Path.Path
  const code = yield* path.fromFileUrl(new URL(import.meta.url))
  yield* L.user(code)
  const reviews = yield* Effect.all({
    security,
    performance,
    maintainability,
  })
  yield* L.user(JSON.stringify(Object.values(reviews), null, 2))
  yield* L.user`You are a technical lead summarizing multiple code reviews.`
  const summary = yield* L.assistant
  return { reviews, summary }
}).pipe(
  Effect.provide(
    Strand.new`
      You are a technical lead summarizing multiple code reviews. Review the supplied code.
    `,
  ),
  Effect.provide(model),
  Effect.provide(BunPath.layer),
  Effect.runPromise,
)
