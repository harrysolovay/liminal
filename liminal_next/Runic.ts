import type { Rune } from "./Rune.ts"
import type { DeferredOr } from "./util/DeferredOr.ts"

export type RuneIterable<Y extends Rune = Rune, T = any> = Iterable<Y, T> | AsyncIterable<Y, T>

export type Runic<Y extends Rune = Rune, T = any> = DeferredOr<RuneIterable<Y, T>>

export declare namespace Runic {
  export type Y<S extends Runic> = Extract<
    S extends RuneIterable<infer Y extends Rune> ? Y : S extends (() => RuneIterable<infer Y extends Rune>) ? Y : never,
    Rune
  >

  export type T<S extends Runic> = S extends RuneIterable<Rune, infer T> ? Awaited<T>
    : S extends (() => RuneIterable<Rune, infer T>) ? Awaited<T>
    : never
}

export type RunicCollection = Array<Runic> | Record<string, Runic>
export declare namespace RunicCollection {
  export type T<S extends RunicCollection> = { -readonly [K in keyof S]: Runic.T<Extract<S[K], Runic>> }
}

export function normalize(runic: Runic): RuneIterable {
  if (Symbol.iterator in runic) {
    return runic
  } else if (Symbol.asyncIterator in runic) {
    return runic
  }
  return runic()
}
