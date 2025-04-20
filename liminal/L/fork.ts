import type { Fiber } from "../Fiber.ts"
import type { ForkRune, Rune } from "../Rune.ts"
import type { Runic } from "../Runic.ts"
import type { StateMap } from "../StateMap.ts"

export interface fork<Y extends Rune, T> extends Generator<ForkRune, Fiber<Y, T>> {}

export function* fork<Y extends Rune, T>(runic: Runic<Y, T>, state?: StateMap): fork<Y, T> {
  return yield {
    type: "fork",
    runic,
    state,
  }
}
