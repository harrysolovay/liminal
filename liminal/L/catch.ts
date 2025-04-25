import { Fiber } from "../Fiber.ts"
import type { Rune } from "../Rune.ts"
import type { Runic } from "../Runic.ts"
import { rune } from "./rune.ts"

export { catch_ as catch }
function* catch_<Y extends Rune, T>(runic: Runic<Y, T>): Generator<Rune<Y>, CatchResult<T>> {
  return yield* rune(async (fiber) => {
    try {
      return { resolved: await fiber.fork(runic).resolution() }
    } catch (exception: unknown) {
      return { rejected: exception }
    }
  })
}
Object.defineProperty(catch_, "name", { value: "catch" })

export type CatchResult<T> = {
  resolved: T
  rejected?: never
} | {
  resolved?: never
  rejected: unknown
}
