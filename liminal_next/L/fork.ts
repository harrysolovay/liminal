import type { Fiber } from "../Fiber.ts"
import type { Fork, Rune } from "../Rune.ts"
import type { RuneIterable } from "../Runic.ts"
import type { StateMap } from "../StateMap.ts"

export function* fork<Y extends Rune, T>(runic: RuneIterable<Y, T>, state?: StateMap): Generator<Fork, Fiber<Y, T>> {
  return yield {
    type: "fork",
    runic,
    state,
  }
}
