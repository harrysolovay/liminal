import type { EnsureNarrow } from "liminal-util"
import { handler } from "../Fiber.ts"
import type { Rune } from "../Rune.ts"
import { rune } from "./rune.ts"

export interface emit<E> extends Generator<Rune<E>, void> {}

export function* emit<const E>(event: EnsureNarrow<E>): emit<E> {
  yield* rune((fiberConfig) => handler(fiberConfig, event))<E>()
}
