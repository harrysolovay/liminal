import type { EnsureNarrow } from "liminal-util"
import { Context } from "../Context.ts"
import type { Rune } from "../Rune.ts"
import { Fiber } from "../state/Fiber.ts"
import { Globals } from "../state/Globals.ts"

export interface emit<E> extends Generator<Rune<E>, void> {}

export function* emit<const E>(event: EnsureNarrow<E>): emit<E> {
  const globals = Context.getAssert(Globals.make)
  const fiber = Context.getAssert(Fiber.make)
  globals.handler?.(event, {
    fiber: fiber.index,
    timestamp: Date.now(),
  })
}
