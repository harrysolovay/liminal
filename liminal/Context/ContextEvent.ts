import type { ActionEvent } from "../Action/ActionEvent.js"
import type { EventBase } from "../Action/ActionEventBase.js"

export type ContextEvent<K extends string = string, E extends ActionEvent = any, T = any> =
  | ContextEnterEvent<K>
  | ContextInnerEvent<K, E>
  | ContextExitEvent<K, T>

export interface ContextEnterEvent<K extends string> extends EventBase<"ContextEnter"> {
  context: K
  system?: string
}

export interface ContextInnerEvent<K extends string, E extends ActionEvent> extends EventBase<"ContextInner"> {
  context: K
  inner: E
}

export interface ContextExitEvent<K extends string, T> extends EventBase<"ContextExit"> {
  context: K
  result: T
}
