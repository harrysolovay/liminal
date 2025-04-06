import type { Message } from "../Message.ts"
import type { EventBase } from "./_EventBase.ts"

export interface MessageAppendedEvent<M extends Message = Message> extends EventBase<"message_appended"> {
  message: M
}
