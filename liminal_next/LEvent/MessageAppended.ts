import type { Message } from "../Message.ts"
import type { LEventBase } from "./_LEventBase.ts"

export interface MessageAppended extends LEventBase<"message_appended"> {
  message: Message
}
