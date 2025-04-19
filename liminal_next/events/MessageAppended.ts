import type { Message } from "../Message.ts"

export interface MessageAppended {
  type: "message_appended"
  // message: Reference<Message>
}
