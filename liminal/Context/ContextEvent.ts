import type { ActionEvent } from "../Action/ActionEvent.js"
import type { EventBase } from "../Action/ActionEventBase.js"

export type ContextEvent<K extends keyof any = keyof any, E extends ActionEvent = any, T = any> =
  | ContextEnterEvent<K>
  | ContextInnerEvent<K, E>
  | ContextExitEvent<K, T>

export interface ContextEnterEvent<K extends keyof any> extends EventBase<"ContextEnter"> {
  context: K
}

export interface ContextInnerEvent<K extends keyof any, E extends ActionEvent> extends EventBase<"ContextInner"> {
  context: K
  inner: E
}

export interface ContextExitEvent<K extends keyof any, T> extends EventBase<"ContextExit"> {
  context: K
  result: T
}
