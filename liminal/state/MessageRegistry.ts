import type { Message } from "../Message.ts"

// TODO: marks and tags
export class MessageRegistry {
  static make() {
    return new MessageRegistry()
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
