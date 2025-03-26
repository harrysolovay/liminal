export interface EventBase<K extends string> {
  event: K
}

export interface EnterEvent extends EventBase<"Enter"> {}

export interface ExitEvent<T = any> extends EventBase<"Exit"> {
  result: T
}
