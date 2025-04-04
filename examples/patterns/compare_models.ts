import { openai } from "@ai-sdk/openai"
import { exec, L } from "liminal"
import { AILanguageModel } from "liminal-ai"

exec(Refine("Write a rap about type-level programming in TypeScript"), {
  bind: {
    default: AILanguageModel(openai("gpt-4o-mini")),
    a: AILanguageModel(openai("gpt-4o-mini")),
    b: AILanguageModel(openai("gpt-4o-mini")),
    c: AILanguageModel(openai("gpt-4o-mini")),
    select: AILanguageModel(openai("gpt-4o-mini")),
  },
  handler: console.log,
})

export function* Refine(input: string) {
  yield* L.declareLanguageModel("default")
  yield* L.user(input)
  yield* L.string
  yield* L.user`Rewrite it in whatever way you think best.`
  const variants = yield* L.fork("variants", {
    *a() {
      yield* L.declareLanguageModel("a")
      return yield* L.string
    },
    *b() {
      yield* L.declareLanguageModel("b")
      return yield* L.string
    },
    *c() {
      yield* L.declareLanguageModel("c")
      return yield* L.string
    },
  })
  const best = yield* L.fork("selection", function*() {
    yield* L.declareLanguageModel("select")
    yield* L.user`
      Out of the following variants, which is your favorite?:

      ${JSON.stringify(variants)}
    `
    return yield* L.enum("a", "b", "c")
  })
  return variants[best]
}
