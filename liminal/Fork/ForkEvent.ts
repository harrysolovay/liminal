import type { ActionEvent } from "../Action/ActionEvent.ts"
import type { ActionEventBase } from "../Action/ActionEventBase.ts"

export interface ForkEvent<K extends keyof any = keyof any, E extends ActionEvent = any>
  extends ActionEventBase<"fork">
{
  fork: K
  event: E
}

export interface ForkArmEvent<L extends keyof any = keyof any, E extends ActionEvent = any>
  extends ActionEventBase<"fork_arm">
{
  arm: L
  event: E
}
