import type { Message } from "../Message.ts"

export class MessageRegistry {
  constructor(readonly messages: Array<Message> = []) {}

  clone() {
    return new MessageRegistry([...this.messages])
  }

  append(message: Message) {
    console.log(message, "\n")
    this.messages.push(message)
  }
}
