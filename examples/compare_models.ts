import { OpenAiLanguageModel } from "@effect/ai-openai"
import { Effect, Layer, Schema } from "effect"
import { L } from "liminal"
import { client, model } from "./_layers.ts"
import { logger } from "./_logger.ts"

Effect.gen(function*() {
  yield* logger
  yield* L.user`Write a rap about type-level programming in TypeScript`
  yield* L.assistant
  yield* L.user`Rewrite it in whatever way you think best.`
  const variants = yield* Effect.all({
    a: L.branch(L.assistant),
    b: L.assistant.pipe(
      L.branch,
      Effect.provide(OpenAiLanguageModel.model("gpt-4-turbo")),
    ),
    c: L.assistant.pipe(
      L.branch,
      Effect.provide(OpenAiLanguageModel.model("gpt-3.5-turbo")),
    ),
  }, { concurrency: "unbounded" })
  yield* L.clear
  yield* L.user`
    Out of the following variants, which is your favorite?:

    ${JSON.stringify(variants)}
  `
  const { key } = yield* L.assistantStruct({
    key: Schema.Literal("a", "b", "c"),
  })
  return variants[key]
}).pipe(
  L.strand,
  Effect.provide(
    Layer.merge(model, client),
  ),
  Effect.runPromise,
)
