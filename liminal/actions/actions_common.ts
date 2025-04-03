import type { ActionEvent } from "../ActionEvent.ts"
import type { ActionEventBase } from "./actions_base.ts"

export interface EnteredEvent extends ActionEventBase<"entered"> {}

export interface ChildEvent<
  S extends ChildEventSource = ChildEventSource,
  K extends keyof any = keyof any,
  E extends ActionEvent = any,
> extends ActionEventBase<"child"> {
  scopeType: S
  scope: K
  event: E
}

export type ChildEventSource = "context" | "tool" | "fork" | "set_messages"

export interface ExitedEvent<T = any> extends ActionEventBase<"exited"> {
  result: T
}
