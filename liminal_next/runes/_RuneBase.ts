import type { LEvent } from "../events/LEvent.ts"
import type { Rune } from "./Rune.ts"

export interface RuneBase<K extends string, E extends LEvent = never> {
  type: K
  event: E
}

export function RuneBase<X extends Rune>(type: X["type"], fields: Omit<X, "type" | "event">): X {
  return { type, ...fields } as never
}
