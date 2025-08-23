import { FileSystem, Path } from "@effect/platform"
import { BunContext } from "@effect/platform-bun"
import { Console, Effect, Schema } from "effect"
import { F, L } from "liminal"
import { ModelLive } from "./_layers.ts"

const Lmh = Schema.Literal("lower", "medium", "high")

const security = L.sequence(
  L.system`
    You are an expert in code security. Focus on identifying security
    vulnerabilities, injection risks, and authentication issues.
  `,
  L.assistantSchema({
    type: Schema.Literal("security"),
    vulnerabilities: Schema.Array(Schema.String),
    riskLevel: Lmh,
    suggestions: Schema.Array(Schema.String),
  }),
).pipe(
  L.provide(
    L.branch,
  ),
)

const performance = L.sequence(
  L.system`
    You are an expert in code performance. Focus on identifying performance
    bottlenecks, memory leaks, and optimization opportunities.
  `,
  L.assistantSchema({
    type: Schema.Literal("performance"),
    issues: Schema.Array(Schema.String),
    impact: Lmh,
    optimizations: Schema.Array(Schema.String),
  }),
).pipe(
  L.provide(
    L.branch,
  ),
)

const maintainability = L.sequence(
  L.system`
    You are an expert in code quality. Focus on code structure,
    readability, and adherence to best practices.
  `,
  L.assistantSchema({
    type: Schema.Literal("maintainability"),
    concerns: Schema.Array(Schema.String),
    qualityScore: Schema.Int,
    recommendations: Schema.Array(Schema.String),
  }),
).pipe(
  L.provide(
    L.branch,
  ),
)

Effect.gen(function*() {
  const path = yield* Path.Path
  const fs = yield* FileSystem.FileSystem

  const code = yield* path.fromFileUrl(
    new URL(import.meta.url),
  ).pipe(
    Effect.flatMap(fs.readFileString),
  )

  const reviews = yield* L.sequence(
    L.system`
      You are a technical lead summarizing multiple code reviews. Review the supplied code.
    `,
    L.user(code),
    Effect.all({ security, performance, maintainability }, {
      concurrency: "unbounded",
    }),
  ).pipe(
    L.provide(
      L.thread,
    ),
  )

  const summary = yield* L.sequence(
    L.system`You are a technical lead summarizing multiple code reviews.`,
    L.user`Please summarize the following code reviews.`,
    L.user(
      F.json(reviews),
    ),
    L.assistant,
  ).pipe(
    L.provide(
      L.thread,
    ),
  )

  yield* Console.log({ reviews, summary })
}).pipe(
  Effect.provide([ModelLive, BunContext.layer]),
  Effect.runPromise,
)
