import type { Fiber } from "./Fiber.ts"

export interface Rune<out E = any> {
  (fiber: Fiber): any
  [RuneKey]: E
}

export declare namespace Rune {
  export type E<X extends Rune> = X[RuneKey]
}

export const RuneKey: unique symbol = Symbol.for("liminal/Rune")
export type RuneKey = typeof RuneKey

export function isRune(value: unknown): value is Rune {
  return typeof value === "object" && value !== null && RuneKey in value
}
