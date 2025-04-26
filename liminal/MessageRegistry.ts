import { ContextPart } from "./Context.ts"
import type { Message } from "./Message.ts"

export class MessageRegistry {
  messages: Array<Message>
  constructor(messages?: Array<Message>) {
    this.messages = messages ?? []
  }

  append(message: Message): void {
    this.messages.push(message)
  }

  clone(): MessageRegistry {
    return new MessageRegistry([...this.messages])
  }
}

export const MessageRegistryContext: ContextPart<MessageRegistry> = ContextPart(
  (parent) => parent?.clone() ?? new MessageRegistry(),
  "message_registry",
)
