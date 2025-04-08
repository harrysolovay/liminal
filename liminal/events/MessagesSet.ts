import type { Message } from "../Message.ts"
import type { EventBase } from "./_EventBase.ts"

export interface MessagesSet extends EventBase<"messages_set"> {
  messages: Array<Message>
}
