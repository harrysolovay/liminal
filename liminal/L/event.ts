import type { EnsureNarrow } from "liminal-util"
import { Fiber } from "../Fiber.ts"
import type { Rune } from "../Rune.ts"

export interface event<E> extends Generator<Rune<E>, void> {}

export function* event<const E>(event: EnsureNarrow<E>): event<E> {
  const self = yield* Fiber
  self.handle(event)
}
