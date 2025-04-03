import { type } from "arktype"
import { L } from "liminal"

export function* refine(input: string) {
  yield* L.declareLanguageModel("default")
  yield* L.user(input)
  yield* L.infer()
  yield* L.user`Rewrite it in whatever way you think best.`
  const variants = yield* L.fork("variants", {
    *a() {
      yield* L.declareLanguageModel("a")
      return yield* L.infer()
    },
    *b() {
      yield* L.declareLanguageModel("b")
      return yield* L.infer()
    },
    *c() {
      yield* L.declareLanguageModel("c")
      return yield* L.infer()
    },
  })
  const best = yield* L.context("selection", function*() {
    yield* L.declareLanguageModel("select")
    yield* L.user`
      Out of the following variants, which is your favorite?:

      ${JSON.stringify(variants)}
    `
    return yield* L.infer(type("'a' | 'b' | 'c'"))
  })
  return variants[best]
}
