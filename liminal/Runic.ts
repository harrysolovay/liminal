import type { Rune } from "./Rune.ts"

export type RuneIterator<Y extends Rune = Rune, T = any> = Iterator<Y, T> | AsyncIterator<Y, T>
export type RuneIterable<Y extends Rune, T> = Iterable<Y, T> | AsyncIterable<Y, T>
export type Runic<Y extends Rune = Rune, T = any> = RuneIterable<Y, T> | (() => RuneIterable<Y, T>)
export declare namespace Runic {
  export type Y<R extends Runic> = R extends Runic<infer Y> ? Y : never
  export type T<R extends Runic> = R extends Runic<Rune, infer T> ? T : never
}

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
