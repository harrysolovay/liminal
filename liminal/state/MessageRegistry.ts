import type { Message } from "../Message.ts"

// TODO: marks and tags
export class MessageRegistry {
  static make(messageRegistry?: MessageRegistry) {
    return new MessageRegistry(messageRegistry?.messages ? [...messageRegistry?.messages] : undefined)
  }

  messages: Array<Message>
  constructor(messages: Iterable<Message> = []) {
    this.messages = Array.from(messages)
  }

  clone() {
    return new MessageRegistry([...this.messages])
  }

  append(message: Message) {
    this.messages.push(message)
  }
}
