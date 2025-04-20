import type { Fiber } from "../Fiber.ts"
import type { ForkRune, Rune } from "../Rune.ts"
import type { Runic } from "../Runic.ts"
import type { StateMap } from "../StateMap.ts"

export function* fork<Y extends Rune, T>(runic: Runic<Y, T>, state?: StateMap): Generator<ForkRune, Fiber<Y, T>> {
  return yield {
    type: "fork",
    runic,
    state,
  }
}
