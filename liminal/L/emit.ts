import type { EnsureNarrow } from "liminal-util"
import { AgentContext } from "../AgentContext.ts"
import type { Rune } from "../Rune.ts"

export interface emit<E> extends Generator<Rune<E>, void> {}

export function* emit<const E>(event: EnsureNarrow<E>): emit<E> {
  const { handler } = AgentContext.get()
  handler?.(event)
}
