import { L } from "liminal"

export function* refine(input: string) {
  yield* L.user(input)
  yield* L.infer()
  yield* L.user`Rewrite it in whatever way you think best.`
  const variants = yield* L.branch("variants", {
    *a() {
      yield* L.declareModel("a")
      return yield* L.infer()
    },
    *b() {
      yield* L.declareModel("b")
      return yield* L.infer()
    },
    *c() {
      yield* L.declareModel("c")
      return yield* L.infer()
    },
  })
  const { value } = yield* L.branch("select", function*() {
    yield* L.clear()
    yield* L.declareModel("select")
    yield* L.user`
      Out of the following variants, which is your favorite?:

      ${JSON.stringify(variants)}
    `
    return yield* L.wrapper(L.enum("a", "b", "c"))
  })
  return variants[value]
}
