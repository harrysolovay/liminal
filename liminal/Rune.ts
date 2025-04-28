import type { LEvent } from "./LEvent.ts"

export type Rune<E = LEvent> = ContinuationRune | EventRune<E> | FiberRune

export interface ContinuationRune extends RuneBase<"continuation", never> {
  f: () => any
  debug: string
}

export interface EventRune<E> extends RuneBase<"event", E> {}

export interface FiberRune extends RuneBase<"fiber", never> {}

interface RuneBase<K extends string, E> {
  [RuneKey]: true
  kind: K
  event: E
}

export type AnyRune = Rune<any>

export declare namespace Rune {
  export type E<X extends AnyRune> = X["event"]
}

export const RuneKey: unique symbol = Symbol.for("liminal/Rune")
export type RuneKey = typeof RuneKey

export function isRune(value: unknown): value is AnyRune {
  return typeof value === "object" && value !== null && RuneKey in value
}
