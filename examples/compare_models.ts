import { OpenAiLanguageModel } from "@effect/ai-openai"
import * as Console from "effect/Console"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import { L, Strand } from "liminal"
import { common } from "./_common.ts"

await Effect.gen(function*() {
  yield* L.user`Write a rap about type-level programming in TypeScript`
  yield* L.assistant
  yield* L.user`Rewrite it in whatever way you think best.`
  const variants = yield* Effect.all({
    a: L.assistant.pipe(Effect.provide(Strand.layer())),
    b: L.assistant.pipe(
      Effect.provide(Strand.layer()),
      Effect.provide(OpenAiLanguageModel.model("gpt-4-turbo")),
    ),
    c: L.assistant.pipe(
      Effect.provide(Strand.layer()),
      Effect.provide(OpenAiLanguageModel.model("gpt-3.5-turbo")),
    ),
  }, { concurrency: "unbounded" })
  const key = yield* Effect.gen(function*() {
    yield* L.user`
      Out of the following variants, which is your favorite?:

      ${JSON.stringify(variants)}
    `
    return yield* L.assistantStruct(Schema.Struct({
      inner: Schema.Literal("a", "b", "c"),
    })).pipe(Effect.map(({ inner }) => inner))
  })
  return variants[key]
}).pipe(
  Effect.provide(Strand.layer({
    onMessage: Console.log,
  })),
  common,
  Effect.runPromise,
)
