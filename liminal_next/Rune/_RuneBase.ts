import type { LEvent } from "../LEvent/LEvent.ts"

export interface RuneBase<K extends string, E extends LEvent = never> {
  type: K
  event: E
}
