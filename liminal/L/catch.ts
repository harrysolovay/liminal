import { assert } from "liminal-util"
import { Context } from "../Context.ts"
import { Fiber } from "../Fiber.ts"
import type { Rune } from "../Rune.ts"
import type { Runic } from "../Runic.ts"
import { continuation } from "./continuation.ts"
import { fiber } from "./fiber.ts"

export { catch_ as catch }

function* catch_<Y extends Rune, T>(runic: Runic<Y, T>): Generator<Rune<Y>, CatchResult<T>> {
  const parent = yield* fiber
  return yield* continuation(async () => {
    try {
      const context = Context.get()
      assert(context)
      return {
        resolved: await context.fork().run(() => new Fiber(runic, { parent }).resolution()),
      }
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
