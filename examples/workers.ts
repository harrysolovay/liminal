import { Console, Effect, Schema } from "effect"
import L from "liminal"
import { ModelLive } from "./_layers.ts"

const IMPLEMENTATION_PROMPTS = {
  create: "You are an expert at implementing new files following best practices and project patterns.",
  modify: "You are an expert at modifying existing code while maintaining consistency and avoiding regressions.",
  delete: "You are an expert at safely removing code while ensuring no breaking changes.",
}

Effect.gen(function*() {
  yield* L.system`You are a senior software architect planning feature implementations.`
  yield* L.user`Analyze this feature request and create an implementation plan:`
  yield* L.user`Alert administrators via text whenever site traffic exceeds a certain threshold.`

  const plan = yield* L.assistantSchema({
    complexity: Schema.Literal("low", "medium", "high"),
    files: Schema.Array(
      Schema.Struct({
        changeType: Schema.Literal("create", "modify", "delete"),
        filePath: Schema.String,
        purpose: Schema.String,
      }),
    ),
  })

  const changes = yield* Effect.all(
    plan.files.map(
      Effect.fn(
        function*(file) {
          yield* L.system(IMPLEMENTATION_PROMPTS[file.changeType])
          yield* L.user`Implement the changes for ${file.filePath} to support: ${file.purpose}`
          const implementation = yield* L.assistantSchema({
            explanation: Schema.String,
            code: Schema.String,
          })
          return { file, implementation }
        },
        (e) => L.thread(e),
      ),
    ),
    { concurrency: "unbounded" },
  )

  yield* Console.log({ plan, changes })
}).pipe(
  L.thread,
  Effect.provide(ModelLive),
  Effect.runFork,
)
