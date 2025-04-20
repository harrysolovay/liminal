import type { Fiber } from "../Fiber.ts"
import type { JoinRune } from "../Rune.ts"

export interface join<XA extends Array<Fiber>> extends Generator<JoinRune, { [I in keyof XA]: XA[I]["T"] }> {}

export function* join<XA extends Array<Fiber>>(...fibers: XA): join<XA> {
  return yield {
    type: "join",
    fibers,
  }
}
