import type { ActionEventBase } from "../Action/ActionEventBase.ts"

export interface ExecEnteredEvent extends ActionEventBase<"exec_entered"> {}

export interface ExecExitedEvent<T = any> extends ActionEventBase<"exec_exited"> {
  result: T
}
