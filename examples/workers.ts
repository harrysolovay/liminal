import { Effect, Schema } from "effect"
import { L, Strand } from "liminal"
import { model } from "./_layers.ts"
import { logger } from "./_logger.ts"

const IMPLEMENTATION_PROMPTS = {
  create: "You are an expert at implementing new files following best practices and project patterns.",
  modify: "You are an expert at modifying existing code while maintaining consistency and avoiding regressions.",
  delete: "You are an expert at safely removing code while ensuring no breaking changes.",
}

Effect
  .gen(function*() {
    yield* logger

    yield* L.user`Analyze this feature request and create an implementation plan:`
    yield* L.user`Alert administrators via text whenever site traffic exceeds a certain threshold.`
    const implementationPlan = yield* L.assistantStruct({
      complexity: Schema.Literal("low", "medium", "high"),
      files: Schema.Array(
        Schema.Struct({
          changeType: Schema.Literal("create", "modify", "delete"),
          filePath: Schema.String,
          purpose: Schema.String,
        }),
      ),
    })
    const fileChanges = yield* Effect.all(
      implementationPlan.files.map((file) =>
        Effect
          .gen(function*() {
            yield* L.user`Implement the changes for ${file.filePath} to support: ${file.purpose}`
            const implementation = yield* L.assistantStruct({
              explanation: Schema.String,
              code: Schema.String,
            })
            return { file, implementation }
          })
          .pipe(
            Effect.provide(
              Strand.new(IMPLEMENTATION_PROMPTS[file.changeType]),
            ),
          )
      ),
      { concurrency: "unbounded" },
    )
    return { fileChanges, implementationPlan }
  })
  .pipe(
    Effect.provide(
      Strand.new`
        You are a senior software architect planning feature implementations.
      `,
    ),
    Effect.provide(model),
    Effect.runPromise,
  )
