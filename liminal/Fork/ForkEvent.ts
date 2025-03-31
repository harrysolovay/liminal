import type { ActionEvent } from "../Action/ActionEvent.js"
import type { ActionEventBase } from "../Action/ActionEventBase.js"

export type ForkEvent =
  | ForkEnteredEvent
  | ForkArmEnteredEvent
  | ForkArmInnerEvent
  | ForkArmExitedEvent
  | ForkExitedEvent

export interface ForkEnteredEvent<K extends keyof any = keyof any> extends ActionEventBase<"fork_entered"> {
  fork: K
}

export interface ForkArmEnteredEvent<K extends keyof any = keyof any, L extends keyof any = keyof any>
  extends ActionEventBase<"fork_arm_entered">
{
  fork: K
  arm: L
}

export interface ForkArmInnerEvent<
  K extends keyof any = keyof any,
  L extends keyof any = keyof any,
  E extends ActionEvent = any,
> extends ActionEventBase<"fork_arm_inner"> {
  fork: K
  arm: L
  event: E
}

export interface ForkArmExitedEvent<K extends keyof any = keyof any, L extends keyof any = keyof any, R = any>
  extends ActionEventBase<"fork_arm_exited">
{
  fork: K
  arm: L
  result: R
}

export interface ForkExitedEvent<K extends keyof any = keyof any, R = any> extends ActionEventBase<"fork_exited"> {
  fork: K
  result: R
}
