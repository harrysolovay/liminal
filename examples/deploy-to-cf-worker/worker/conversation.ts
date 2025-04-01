import { type } from "arktype"
import { context, declareLanguageModel, fork, infer, setLanguageModel } from "liminal"

export function* Refine(input: string) {
  yield* declareLanguageModel("default")
  yield input
  yield* infer()
  yield* "Rewrite it in whatever way you think best."
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
