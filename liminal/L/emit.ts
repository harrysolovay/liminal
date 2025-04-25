import type { EnsureNarrow } from "liminal-util"
import { Context } from "../Context.ts"
import { HandlerContext } from "../Handler.ts"
import type { Rune } from "../Rune.ts"
import { rune } from "./rune.ts"

export interface emit<E> extends Generator<Rune<E>, void> {}

export function* emit<const E>(event: EnsureNarrow<E>): emit<E> {
  const context = Context.ensure()
  const handler = context.get(HandlerContext)
  const fiber = yield* rune
  handler?.call(fiber, event)
}
