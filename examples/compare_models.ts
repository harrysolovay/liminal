import { OpenAiLanguageModel } from "@effect/ai-openai"
import { Console, Effect, Schema } from "effect"
import { L } from "liminal"
import { ClientLive, ModelLive } from "./_layers.ts"
import { logger } from "./_logger.ts"

Effect.gen(function*() {
  yield* logger
  yield* L.user`Write a rap about type-level programming in TypeScript`
  yield* L.assistant
  yield* L.user`Rewrite it in whatever way you think best.`

  const rewrites = yield* Effect.all({
    a: L.assistant.pipe(
      L.provide(
        L.branch,
      ),
    ),
    b: L.assistant.pipe(
      L.provide(
        L.branch,
      ),
      Effect.provide(
        OpenAiLanguageModel.model("gpt-4-turbo"),
      ),
    ),
    c: L.assistant.pipe(
      L.provide(
        L.branch,
      ),
      Effect.provide(
        OpenAiLanguageModel.model("gpt-3.5-turbo"),
      ),
    ),
  }, { concurrency: "unbounded" })

  yield* L.clear
  yield* L.user`
    Out of the following variants, which is your favorite?:

    ${JSON.stringify(rewrites)}
  `
  yield* L.assistantSchema(Schema.Literal("a", "b", "c")).pipe(
    Effect.flatMap((key) => Console.log(rewrites[key])),
  )
}).pipe(
  L.provide(
    L.thread,
  ),
  Effect.scoped,
  Effect.provide([ModelLive, ClientLive]),
  Effect.runFork,
)
