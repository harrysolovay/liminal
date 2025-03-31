import type { ActionEvent } from "../Action/ActionEvent.js"
import type { ActionEventBase } from "../Action/ActionEventBase.js"

export type ContextEvent<K extends keyof any = keyof any, E extends ActionEvent = any, T = any> =
  | ContextEnterEvent<K>
  | ContextInnerEvent<K, E>
  | ContextExitEvent<K, T>

export interface ContextEnterEvent<K extends keyof any> extends ActionEventBase<"ContextEnter"> {
  context: K
}

export interface ContextInnerEvent<K extends keyof any, E extends ActionEvent> extends ActionEventBase<"ContextInner"> {
  context: K
  inner: E
}

export interface ContextExitEvent<K extends keyof any, T> extends ActionEventBase<"ContextExit"> {
  context: K
  result: T
}
