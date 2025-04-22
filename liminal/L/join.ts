import type { Fiber } from "../Fiber.ts"
import type { Rune } from "../Rune.ts"
import { rune } from "./rune.ts"

export interface join<X extends Fiber> extends Generator<Rune<never>, X["T"]> {}

export function* join<X extends Fiber>(fiber: X): join<X> {
  return yield* rune((_fiber) => fiber.run())
}
