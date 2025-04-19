import type { Message } from "./Message.ts"

export class MessageRegistry {
  messages: Array<Message>
  constructor(initial?: MessageRegistry) {
    this.messages = initial?.messages ?? []
  }

  push(message: Message) {
    this.messages.push(message)
  }
}
