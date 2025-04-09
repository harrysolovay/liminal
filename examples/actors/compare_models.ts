import { L } from "liminal"

export default function*() {
  yield* L.user`Write a rap about type-level programming in TypeScript`
  yield* L.infer()
  yield* L.user`Rewrite it in whatever way you think best.`
  const variants = yield* L.branch("variants", {
    *a() {
      yield* L.declareModel("one")
      return yield* L.infer()
    },
    *b() {
      yield* L.declareModel("two")
      return yield* L.infer()
    },
    *c() {
      yield* L.declareModel("three")
      return yield* L.infer()
    },
  })
  const { value } = yield* L.branch("best", function*() {
    yield* L.clear()
    yield* L.declareModel("arbiter")
    yield* L.user`
      Out of the following variants, which is your favorite?:

      ${JSON.stringify(variants)}
    `
    return yield* L.wrapper(L.enum("a", "b", "c"))
  })
  return variants[value]
}
