import { Fiber } from "../Fiber.ts"
import type { Rune } from "../Rune.ts"
import type { Runic } from "../Runic.ts"
import type { StateMap } from "../state/StateMap.ts"
import { rune } from "./rune.ts"

export interface fork<Y extends Rune, T> extends Generator<Rune<never>, Fiber<Y, T>> {}

export function* fork<Y extends Rune, T>(runic: Runic<Y, T>, state?: StateMap): fork<Y, T> {
  return yield* rune((fiber) => Fiber(fiber.globals, runic, state))
}
