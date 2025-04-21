import type { Rune } from "../Rune.ts"
import { rune } from "./rune.ts"

export interface event<E> extends Generator<Rune<E>, void> {}

export function* event<const E>(event: E): event<E> {
  return yield* rune((fiber) => {
    fiber.globals.handler({
      type: "event",
      event,
    })
  })
}
