import type { Rune } from "./Rune.ts"

export type RuneIterable<Y extends Rune, T> = Iterable<Y, T> | AsyncIterable<Y, T>
export type Runic<Y extends Rune = Rune, T = any> = RuneIterable<Y, T> | (() => RuneIterable<Y, T>)

export function unwrapRunic<Y extends Rune, T>(runic: Runic<Y, T>): RuneIterable<Y, T> {
  if (Symbol.iterator in runic || Symbol.asyncIterator in runic) {
    return runic
  }
  return runic()
}
