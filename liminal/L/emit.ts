import type { EnsureNarrow } from "liminal-util"
import type { Rune } from "../Rune.ts"
import { rune } from "./rune.ts"

export interface emit<E> extends Generator<Rune<E>, void> {}

export function* emit<const E>(event: EnsureNarrow<E>): emit<E> {
  yield* rune((fiber) => {
    fiber.handler(event)
  })<E>()
}
