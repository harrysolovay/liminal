import type { Fiber } from "./Fiber.ts"

export interface Rune<out E = any> {
  (fiber: Fiber): any
  [RuneKey]: { E: E }
}

export const RuneKey: unique symbol = Symbol.for("liminal/Rune")

export function isRune(value: unknown): value is Rune {
  return typeof value === "object" && value !== null && RuneKey in value
}
