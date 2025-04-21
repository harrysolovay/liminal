import type { Fiber } from "../Fiber.ts"
import { type Rune, RuneKey } from "../Rune.ts"

export interface rune<T> extends Iterable<Rune<never>, T> {
  <E>(): Generator<Rune<E>, T>
}

export function rune<T>(source: (fiber: Fiber) => T): rune<Awaited<T>> {
  return Object.assign(
    function*<E>(): Generator<Rune<E>, Awaited<T>> {
      return yield Object.assign(source, { [RuneKey]: {} as never })
    },
    {
      *[Symbol.iterator](): Generator<Rune<never>, Awaited<T>> {
        return yield Object.assign(source, { [RuneKey]: {} as never })
      },
    },
  )
}
