import type { Message } from "./Message.ts"

export interface MessageRegistry {
  messages: Array<Message>
  append(message: Message): void
}

export function MessageRegistry(messages?: Array<Message>): MessageRegistry {
  return {
    messages: messages ?? [],
    append(message) {
      this.messages.push(message)
    },
  }
}
