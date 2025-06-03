import { Console, Effect, Schema } from "effect"
import { L, strand } from "liminal"
import { provideCommon } from "./_common.ts"

const IMPLEMENTATION_PROMPTS = {
  create: "You are an expert at implementing new files following best practices and project patterns.",
  modify: "You are an expert at modifying existing code while maintaining consistency and avoiding regressions.",
  delete: "You are an expert at safely removing code while ensuring no breaking changes.",
}

await Effect
  .gen(function*() {
    yield* L.user`Analyze this feature request and create an implementation plan:`
    yield* L.user`Alert administrators via text whenever site traffic exceeds a certain threshold.`
    const implementationPlan = yield* L.assistant(Schema.Struct({
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
            const implementation = yield* L.assistant(Schema.Struct({
              explanation: Schema.String,
              code: Schema.String,
            }))
            return { file, implementation }
          })
          .pipe(strand({
            system: IMPLEMENTATION_PROMPTS[file.changeType],
          }))
      ),
      { concurrency: "unbounded" },
    )
    return { fileChanges, implementationPlan }
  })
  .pipe(
    strand({
      system: `You are a senior software architect planning feature implementations.`,
      handler: Console.log,
    }),
    provideCommon,
    Effect.runPromise,
  )
