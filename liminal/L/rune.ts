import type { FiberConfig } from "../Fiber.ts"
import { type Rune, RuneKey } from "../Rune.ts"

export interface rune<T> extends Iterable<Rune<never>, T> {
  <E>(): Generator<Rune<E>, T>
}

export function rune<R>(source: (fiberConfig: FiberConfig) => R): rune<Awaited<R>> {
  return Object.assign(
    function*<E>(): Generator<Rune<E>, Awaited<R>> {
      return yield Object.assign(source, { [RuneKey]: {} as never })
    },
    {
      *[Symbol.iterator](): Generator<Rune<never>, Awaited<R>> {
        return yield Object.assign(source, { [RuneKey]: {} as never })
      },
    },
  )
}
