import { L } from "liminal"

export default function*() {
  yield* L.declareLanguageModel("default")
  yield* L.user`Write a rap about type-level programming in TypeScript`
  yield* L.infer()
  yield* L.user`Rewrite it in whatever way you think best.`
  const variants = yield* L.fork("variants", {
    *a() {
      yield* L.declareLanguageModel("one")
      return yield* L.infer()
    },
    *b() {
      yield* L.declareLanguageModel("two")
      return yield* L.infer()
    },
    *c() {
      yield* L.declareLanguageModel("three")
      return yield* L.infer()
    },
  })
  const { value } = yield* L.fork("best", function*() {
    yield* L.clear()
    yield* L.declareLanguageModel("arbiter")
    yield* L.user`
      Out of the following variants, which is your favorite?:

      ${JSON.stringify(variants)}
    `
    return yield* L.wrapper(L.enum("a", "b", "c"))
  })
  return variants[value]
}
