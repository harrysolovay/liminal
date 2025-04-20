import type { Fiber } from "../Fiber.ts"
import type { JoinRune } from "../Rune.ts"

export function* join<XA extends Array<Fiber>>(
  ...fibers: XA
): Generator<JoinRune | XA[number]["Y"], { [I in keyof XA]: XA[I]["T"] }> {
  return yield {
    type: "join",
    fibers,
  }
}
