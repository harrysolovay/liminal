import type { Rune } from "../Rune.ts"
import { rune } from "./rune.ts"

export interface emit<E> extends Generator<Rune<E>, void> {}

export function* emit<const E>(event: E): emit<E> {
  return yield* rune((fiber) => {
    fiber.globals.handler({
      type: "event",
      event,
    })
  })<E>()
}
