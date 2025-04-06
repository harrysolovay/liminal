import type { Message } from "../Message.ts"
import type { EventBase } from "./_EventBase.ts"

export interface MessageRemovedEvent extends EventBase<"message_removed"> {
  message: Message
}
