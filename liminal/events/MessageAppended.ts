import type { Message } from "../Message.ts"
import type { EventBase } from "./EventBase.ts"

export interface MessageAppended<M extends Message = Message> extends EventBase<"message_appended"> {
  message: M
}
