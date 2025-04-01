import { createOpenAI } from "@ai-sdk/openai"
import { type } from "arktype"
import { env } from "cloudflare:workers"
import { context, fork, infer, setLanguageModel } from "liminal"
import { AILanguageModel } from "liminal-ai"

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
})

export function* Refine(input: string) {
  yield* setLanguageModel("default", AILanguageModel(openai("gpt-4o-mini")))
  yield input
  yield* infer()
  yield* "Rewrite it in whatever way you think best."
  const variants = yield* fork("variants", {
    *a() {
      yield* setLanguageModel("a", AILanguageModel(openai("o1-mini")))
      return yield* infer()
    },
    *b() {
      yield* setLanguageModel("b", AILanguageModel(openai("gpt-3.5-turbo-instruct")))
      return yield* infer()
    },
    *c() {
      yield* setLanguageModel("c", AILanguageModel(openai("gpt-4o")))
      return yield* infer()
    },
  })
  const best = yield* context("selection", function*() {
    yield* setLanguageModel("select", AILanguageModel(openai("gpt-3.5-turbo")))
    yield `
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
