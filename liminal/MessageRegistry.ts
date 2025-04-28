import type { Message } from "./Message.ts"

export class MessageRegistry {
  readonly messages: Array<Message>
  constructor(messages?: Array<Message>) {
    this.messages = messages ?? []
  }

  append(message: Message): void {
    this.messages.push(message)
  }
}
