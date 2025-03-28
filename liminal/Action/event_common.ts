import type { Message } from "../Message.js"

export interface EventBase<K extends string> {
  event: K
}

export interface EnterEvent extends EventBase<"Enter"> {}

export interface ExitEvent<T = any> extends EventBase<"Exit"> {
  result: T
}

export interface MessageEvent extends EventBase<"Message"> {
  message: Message
}
