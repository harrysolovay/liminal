import type { Message } from "../Message.ts"
import type { Reference } from "../Reference.ts"
import type { LEventBase } from "./_LEventBase.ts"

export interface MessageAppended extends LEventBase<"message_appended"> {
  message: Reference<Message>
}
