import { OpenAiLanguageModel } from "@effect/ai-openai"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import { L, strand } from "liminal"
import { common } from "./_common.ts"

await Effect.gen(function*() {
  yield* L.user`Write a rap about type-level programming in TypeScript`
  yield* L.assistant()
  yield* L.user`Rewrite it in whatever way you think best.`
  const variants = yield* Effect.all({
    a: L.assistant().pipe(strand()),
    b: L.assistant().pipe(
      strand(),
      Effect.provide(OpenAiLanguageModel.model("gpt-4-turbo")),
    ),
    c: L.assistant().pipe(
      strand(),
      Effect.provide(OpenAiLanguageModel.model("gpt-3.5-turbo")),
    ),
  }, { concurrency: "unbounded" })
  const key = yield* Effect.gen(function*() {
    yield* L.user`
      Out of the following variants, which is your favorite?:

      ${JSON.stringify(variants)}
    `
    return yield* L.assistant(Schema.Literal("a", "b", "c"))
  })
  return variants[key]
}).pipe(
  strand(),
  common,
  Effect.runPromise,
)
