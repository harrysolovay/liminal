import type { LEvent } from "./events/LEvent.ts"
import type { Rune } from "./runes/Rune.ts"
import type { DeferredOr } from "./util/DeferredOr.ts"

export type RuneIterator<Y extends Rune = Rune, T = any> = Iterator<Y, T> | AsyncIterator<Y, T>

export type RuneIterable<Y extends Rune = Rune, T = any> = Iterable<Y, T> | AsyncIterable<Y, T>

export type Runic<Y extends Rune = Rune, T = any> = DeferredOr<RuneIterator<Y, T> | RuneIterable<Y, T>>
export declare namespace Runic {
  export type Y<S extends Runic> = Extract<
    S extends RuneIterator<infer Y> ? Y
      : S extends RuneIterable<infer Y extends Rune> ? Y
      : S extends (() => RuneIterator<infer Y extends Rune>) ? Y
      : S extends (() => RuneIterable<infer Y extends Rune>) ? Y
      : never,
    Rune
  >

  export type T<S extends Runic> = S extends RuneIterator ? S
    : S extends RuneIterable<Rune, infer T> ? T
    : S extends (() => RuneIterator<Rune, infer T>) ? T
    : S extends (() => RuneIterable<Rune, infer T>) ? T
    : never
}

export type RunicCollection = Array<Runic> | Record<string, Runic>
export declare namespace RunicCollection {
  export type T<S extends RunicCollection> = { -readonly [K in keyof S]: Runic.T<Extract<S[K], Runic>> }
}

export function normalizeRunic(runic: Runic): RuneIterator {
  if ("next" in runic) {
    return runic
  } else if (Symbol.iterator in runic) {
    return runic[Symbol.iterator]()
  } else if (Symbol.asyncIterator in runic) {
    return runic[Symbol.asyncIterator]()
  }
  const unwrapped = runic()
  if ("next" in unwrapped) {
    return unwrapped
  } else if (Symbol.iterator in unwrapped) {
    return unwrapped[Symbol.iterator]()
  }
  return unwrapped[Symbol.asyncIterator]()
}
