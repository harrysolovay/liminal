export interface ActionEventBase<K extends string> {
  type: K
}

export interface EnteredEvent extends ActionEventBase<"entered"> {}

export interface ExitedEvent<T = any> extends ActionEventBase<"exited"> {
  result: T
}
