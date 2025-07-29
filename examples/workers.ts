import * as Console from "effect/Console"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import { L, Strand } from "liminal"
import { common } from "./_common.ts"

const IMPLEMENTATION_PROMPTS = {
  create: "You are an expert at implementing new files following best practices and project patterns.",
  modify: "You are an expert at modifying existing code while maintaining consistency and avoiding regressions.",
  delete: "You are an expert at safely removing code while ensuring no breaking changes.",
}

await Effect
  .gen(function*() {
    yield* L.user`Analyze this feature request and create an implementation plan:`
    yield* L.user`Alert administrators via text whenever site traffic exceeds a certain threshold.`
    const implementationPlan = yield* L.assistantStruct(Schema.Struct({
      complexity: Schema.Literal("low", "medium", "high"),
      files: Schema.Array(Schema.Struct({
        changeType: Schema.Literal("create", "modify", "delete"),
        filePath: Schema.String,
        purpose: Schema.String,
      })),
    }))
    const fileChanges = yield* Effect.all(
      implementationPlan.files.map((file) =>
        Effect
          .gen(function*() {
            yield* L.user`Implement the changes for ${file.filePath} to support: ${file.purpose}`
            const implementation = yield* L.assistantStruct(Schema.Struct({
              explanation: Schema.String,
              code: Schema.String,
            }))
            return { file, implementation }
          })
          .pipe(Effect.provide(Strand.layer({
            system: IMPLEMENTATION_PROMPTS[file.changeType],
          })))
      ),
      { concurrency: "unbounded" },
    )
    return { fileChanges, implementationPlan }
  })
  .pipe(
    Effect.provide(Strand.layer({
      system: `You are a senior software architect planning feature implementations.`,
      onMessage: Console.log,
    })),
    common,
    Effect.runPromise,
  )
