import type { ActionEvent } from "../Action/ActionEvent.js"
import type { ActionEventBase } from "../Action/ActionEventBase.js"

export type ContextEvent = ContextEnteredEvent | ContextInnerEvent | ContextExitedEvent

export interface ContextEnteredEvent<K extends keyof any = keyof any> extends ActionEventBase<"context_entered"> {
  context: K
}

export interface ContextInnerEvent<K extends keyof any = keyof any, E extends ActionEvent = any>
  extends ActionEventBase<"context_inner">
{
  context: K
  inner: E
}

export interface ContextExitedEvent<K extends keyof any = keyof any, T = any>
  extends ActionEventBase<"context_exited">
{
  context: K
  result: T
}
