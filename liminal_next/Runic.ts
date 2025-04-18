import type { LEvent } from "./events/LEvent.ts"
import type { Rune } from "./runes/Rune.ts"
import type { DeferredOr } from "./util/DeferredOr.ts"

export type RuneIterator<Y extends Rune = Rune, T = any> = Iterator<Y, T> | AsyncIterator<Y, T>

export type RuneIterable<Y extends Rune = Rune, T = any> = Iterable<Y, T> | AsyncIterable<Y, T>

export type Runic<Y extends Rune = Rune, T = any> = DeferredOr<RuneIterator<Y, T> | RuneIterable<Y, T>>
export declare namespace Runic {
  export type E<S extends Runic> = Extract<
    S extends RuneIterator ? S
      : S extends RuneIterable<infer Y extends Rune> ? Y["event"]
      : S extends (() => RuneIterator<infer Y extends Rune>) ? Y["event"]
      : S extends (() => RuneIterable<infer Y extends Rune>) ? Y["event"]
      : never,
    LEvent
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

export function normalizeRunic(behavior: Runic): RuneIterator {
  if ("next" in behavior) {
    return behavior
  } else if (Symbol.iterator in behavior) {
    return behavior[Symbol.iterator]()
  } else if (Symbol.asyncIterator in behavior) {
    return behavior[Symbol.asyncIterator]()
  }
  const unwrapped = behavior()
  if ("next" in unwrapped) {
    return unwrapped
  } else if (Symbol.iterator in unwrapped) {
    return unwrapped[Symbol.iterator]()
  }
  return unwrapped[Symbol.asyncIterator]()
}
