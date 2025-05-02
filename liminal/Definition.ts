import type { Rune } from "./Rune.ts"

export type RuneIterator<Y extends Rune<any> = Rune<any>, T = any> = Iterator<Y, T> | AsyncIterator<Y, T>

export type RuneIterable<Y extends Rune<any> = Rune<any>, T = any> = Iterable<Y, T> | AsyncIterable<Y, T>

export type Definition<Y extends Rune<any> = Rune<any>, T = any> = RuneIterable<Y, T> | (() => RuneIterable<Y, T>)

export namespace Definition {
  /** Extracts the Rune type from a Definition. */
  export type Y<X extends Definition> = X extends RuneIterable<infer Y> ? Y
    : X extends () => RuneIterable<infer Y> ? Y
    : X extends RuneIterator<infer Y> ? Y
    : never

  /** Extracts the result type from a Definition. */
  export type T<X extends Definition> = X extends RuneIterable<Rune<any>, infer T> ? T
    : X extends () => RuneIterable<Rune<any>, infer T> ? T
    : X extends RuneIterator<Rune<any>, infer T> ? T
    : never

  /** Extracts the event type from a Definition. */
  export type E<X extends Definition> = Rune.E<Y<X>>

  /**
   * Converts a Definition into a RuneIterator.
   *
   * This function handles all the different forms a Definition can take:
   * - Synchronous iterables
   * - Asynchronous iterables
   * - Factory functions returning iterables
   *
   * @param definition The definition to unwrap.
   * @returns A RuneIterator ready for consumption.
   */
  export function unwrap<Y extends Rune<any>, T>(definition: Definition<Y, T>): RuneIterator<Y, T> {
    if (Symbol.iterator in definition) {
      return definition[Symbol.iterator]()
    } else if (Symbol.asyncIterator in definition) {
      return definition[Symbol.asyncIterator]()
    }
    const iterable = definition()
    if (Symbol.iterator in iterable) {
      return iterable[Symbol.iterator]()
    }
    return iterable[Symbol.asyncIterator]()
  }
}
