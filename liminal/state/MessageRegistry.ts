import type { Message } from "../Message.ts"

// TODO: marks and tags
export class MessageRegistry {
  messages: Array<Message>
  constructor(messages: Iterable<Message> = []) {
    this.messages = Array.from(messages)
  }

  clone() {
    return new MessageRegistry([...this.messages])
  }

  append(message: Message) {
    console.log(message, "\n")
    this.messages.push(message)
  }
}
