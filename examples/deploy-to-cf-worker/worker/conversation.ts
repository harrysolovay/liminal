import { type } from "arktype"
import { context, declareLanguageModel, fork, infer, user } from "liminal"

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
    return yield* infer(type("'a' | 'b' | 'c'"))
  })
  return variants[best]
}
