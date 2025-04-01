import { openai } from "@ai-sdk/openai"
import { type } from "arktype"
import { context, declareLanguageModel, fork, infer, user } from "liminal"
import { Exec } from "liminal"
import { AILanguageModel } from "liminal-ai"

Exec(Refine("Write a rap about type-level programming in TypeScript"), {
  default: AILanguageModel(openai("gpt-4o")),
  a: AILanguageModel(openai("gpt-4o-mini")),
  b: AILanguageModel(openai("o1-mini")),
  c: AILanguageModel(openai("gpt-3.5-turbo-instruct")),
  select: AILanguageModel(openai("gpt-3.5-turbo")),
}).exec(console.log)

export function* Refine(input: string) {
  yield* declareLanguageModel("default")
  yield* user(input)
  yield* infer()
  yield* user`Rewrite it in whatever way you think best.`
  const variants = yield* fork("variants", {
    *a() {
      yield* declareLanguageModel("a")
      return yield* infer()
    },
    *b() {
      yield* declareLanguageModel("b")
      return yield* infer()
    },
    *c() {
      yield* declareLanguageModel("c")
      return yield* infer()
    },
  })
  const best = yield* context("selection", function*() {
    yield* declareLanguageModel("select")
    yield* user`
      Out of the following variants, which is your favorite?:

      ${JSON.stringify(variants)}
    `
    const { favorite } = yield* infer(type({
      favorite: "'a' | 'b' | 'c'",
    }))
    return favorite
  })
  return variants[best]
}
