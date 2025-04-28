import { Fiber } from "../Fiber.ts"
import type { Rune } from "../Rune.ts"
import type { Runic } from "../Runic.ts"
import { continuation } from "./continuation.ts"
import { self } from "./self.ts"

export { catch_ as catch }

function* catch_<Y extends Rune, T>(runic: Runic<Y, T>): Generator<Rune<Y>, CatchResult<T>> {
  const parent = yield* self
  return yield* continuation(async () => {
    try {
      const resolved = await new Fiber(runic, {
        parent,
        context: parent.context.fork(),
      }).resolution()
      return { resolved }
    } catch (exception: unknown) {
      return { rejected: exception }
    }
  }, "catch")
}
Object.defineProperty(catch_, "name", { value: "catch" })

export type CatchResult<T> = {
  resolved: T
  rejected?: never
} | {
  resolved?: never
  rejected: unknown
}
