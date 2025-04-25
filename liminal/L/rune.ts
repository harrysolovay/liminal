import { Fiber } from "../Fiber.ts"
import { type Rune, RuneKey } from "../Rune.ts"

export interface rune extends Iterable<Rune<never>, Fiber> {
  <R>(source: (fiber: Fiber) => R): Iterable<Rune<never>, Awaited<R>> & {
    <E>(): Generator<Rune<E>, Awaited<R>>
  }
}
export const rune: rune = Object.assign(
  function<R>(source: (fiber: Fiber) => R) {
    return Object.assign(
      function*<E>(): Generator<Rune<E>, Awaited<R>> {
        return yield Object.assign(source, { [RuneKey]: true } as never)
      },
      {
        *[Symbol.iterator](): Generator<Rune<never>, Awaited<R>> {
          return yield Object.assign(source, { [RuneKey]: true } as never)
        },
      },
    )
  },
  {
    *[Symbol.iterator](): Generator<Rune<never>, Fiber> {
      return yield Object.assign((fiber: Fiber) => fiber, { [RuneKey]: true } as never)
    },
  },
)
