import { type } from "arktype"
import { context, DeclareModel, fork, infer } from "liminal"

export function* Refine(input: string) {
  yield* DeclareModel.language("default")
  yield input
  yield* infer()
  yield* "Rewrite it in whatever way you think best."
  const variants = yield* fork("variants", {
    *a() {
      yield* DeclareModel.language("a")
      return yield* infer()
    },
    *b() {
      yield* DeclareModel.language("b")
      return yield* infer()
    },
    *c() {
      yield* DeclareModel.language("c")
      return yield* infer()
    },
  })
  const best = yield* context("selection", function*() {
    yield* DeclareModel.language("select")
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
