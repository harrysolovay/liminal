import { OpenAiLanguageModel } from "@effect/ai-openai"
import { Effect, Schema } from "effect"
import { L, Strand } from "liminal"
import { client, model } from "./_layers.ts"
import { logger } from "./_logger.ts"

Effect.gen(function*() {
  yield* logger

  yield* L.user`Write a rap about type-level programming in TypeScript`
  yield* L.assistant
  yield* L.user`Rewrite it in whatever way you think best.`
  const variants = yield* Effect.all({
    a: L.assistant.pipe(Effect.provide(Strand.new())),
    b: L.assistant.pipe(
      Effect.provide(Strand.new()),
      Effect.provide(OpenAiLanguageModel.model("gpt-4-turbo")),
    ),
    c: L.assistant.pipe(
      Effect.provide(Strand.new()),
      Effect.provide(OpenAiLanguageModel.model("gpt-3.5-turbo")),
    ),
  }, { concurrency: "unbounded" })
  const { key } = yield* Effect.gen(function*() {
    yield* L.user`
      Out of the following variants, which is your favorite?:

      ${JSON.stringify(variants)}
    `
    return yield* L.assistantStruct({
      key: Schema.Literal("a", "b", "c"),
    })
  })
  return variants[key]
}).pipe(
  Effect.provide(Strand.new()),
  Effect.provide(client),
  Effect.provide(model),
  Effect.runPromise,
)
