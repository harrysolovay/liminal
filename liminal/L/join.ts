import type { Fiber } from "../Fiber.ts"
import type { Rune } from "../Rune.ts"

export interface join<XA extends Array<Fiber>> extends Generator<Rune, { [I in keyof XA]: XA[I]["T"] }> {}

export function* join<XA extends Array<Fiber>>(...fibers: XA): join<XA> {
  return yield async (_fiber) => {
    return await Promise.all(fibers.map((fiber) => fiber.promise))
  }
}
