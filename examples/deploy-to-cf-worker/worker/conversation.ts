import { L } from "liminal"

export function* refine(input: string) {
  yield* L.user(input)
  yield* L.infer()
  yield* L.user`Rewrite it in whatever way you think best.`
  const variants = yield* L.branch("variants", {
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
  const { best } = yield* L.branch("select", function*() {
    yield* L.clear()
    yield* L.declareLanguageModel("select")
    yield* L.user`
      Out of the following variants, which is your favorite?:

      ${JSON.stringify(variants)}
    `
    return yield* L.object({
      best: L.enum("a", "b", "c"),
    })
  })
  return variants[best]
}
