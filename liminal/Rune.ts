import type { Fiber } from "./Fiber.ts"

export interface Rune<E = any> {
  ""?: undefined | { E: E }
  apply(fiber: Fiber): any
}
