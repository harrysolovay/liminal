import { Path } from "@effect/platform"
import { BunPath } from "@effect/platform-bun"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import { L, strand } from "liminal"
import { common } from "./_common.ts"

const Lmh = Schema.Literal("lower", "medium", "high")

const security = L.assistant(Schema.Struct({
  type: Schema.Literal("security"),
  vulnerabilities: Schema.Array(Schema.String),
  riskLevel: Lmh,
  suggestions: Schema.Array(Schema.String),
})).pipe(strand({
  system:
    `You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.`,
  messages: undefined,
}))

const performance = L.assistant(Schema.Struct({
  type: Schema.Literal("performance"),
  issues: Schema.Array(Schema.String),
  impact: Lmh,
  optimizations: Schema.Array(Schema.String),
})).pipe(strand({
  system:
    `You are an expert in code performance. Focus on identifying performance bottlenecks, memory leaks, and optimization opportunities.`,
  messages: undefined,
}))

const maintainability = L.assistant(Schema.Struct({
  type: Schema.Literal("maintainability"),
  concerns: Schema.Array(Schema.String),
  qualityScore: Schema.Int,
  recommendations: Schema.Array(Schema.String),
})).pipe(strand({
  system: `You are an expert in code quality. Focus on code structure, readability, and adherence to best practices.`,
  messages: undefined,
}))

Effect.gen(function*() {
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
  const summary = yield* L.assistant()
  return { reviews, summary }
}).pipe(
  strand({
    system: `You are a technical lead summarizing multiple code reviews. Review the supplied code.`,
  }),
  common,
  Effect.provide(BunPath.layer),
  Effect.runPromise,
)
