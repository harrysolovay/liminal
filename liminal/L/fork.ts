import { Fiber } from "../Fiber.ts"
import type { Rune } from "../Rune.ts"
import type { Runic } from "../Runic.ts"
import type { StateMap } from "../StateMap.ts"

export interface fork<Y extends Rune, T> extends Generator<Rune, Fiber<Y, T>> {}

export function* fork<Y extends Rune, T>(runic: Runic<Y, T>, state?: StateMap): fork<Y, T> {
  return yield (fiber) => Fiber(fiber.globals, runic, state)
}
