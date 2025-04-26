import type { EnsureNarrow } from "liminal-util"
import { Fiber } from "../Fiber.ts"
import type { Rune } from "../Rune.ts"

export interface emit<E> extends Generator<Rune<E>, void> {}

export function* emit<const E>(event: EnsureNarrow<E>): emit<E> {
  const self = yield* Fiber
  self.handle(event)
}
