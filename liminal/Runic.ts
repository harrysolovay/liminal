import type { Rune } from "./Rune.ts"

export type RuneIterator<Y extends Rune = Rune, T = any> = Iterator<Y, T> | AsyncIterator<Y, T>
export type RuneIterable<Y extends Rune = Rune, T = any> = Iterable<Y, T> | AsyncIterable<Y, T>
export type Runic<Y extends Rune = Rune, T = any> = RuneIterable<Y, T> | (() => RuneIterable<Y, T>)

export namespace Runic {
  export type Y<X extends Runic> = X extends RuneIterable<infer Y> ? Y
    : X extends () => RuneIterable<infer Y> ? Y
    : X extends RuneIterator<infer Y> ? Y
    : never

  export type T<X extends Runic> = X extends RuneIterable<Rune, infer T> ? T
    : X extends () => RuneIterable<Rune, infer T> ? T
    : X extends RuneIterator<Rune, infer T> ? T
    : never

  export type E<X extends Runic> = Y<X>["E"]

  export function unwrap<Y extends Rune, T>(runic: Runic<Y, T>): RuneIterator<Y, T> {
    if (Symbol.iterator in runic) {
      return runic[Symbol.iterator]()
    } else if (Symbol.asyncIterator in runic) {
      return runic[Symbol.asyncIterator]()
    }
    const iterable = runic()
    if (Symbol.iterator in iterable) {
      return iterable[Symbol.iterator]()
    }
    return iterable[Symbol.asyncIterator]()
  }
}
