import { type MessagesSetEvent, type SetMessages, setMessages } from "../actions/SetMessages.ts"
import type { Message } from "../Message.ts"

export function clear(): Generator<
  SetMessages<{
    Entry: never
    Event: MessagesSetEvent
  }>,
  Array<Message>
> {
  return setMessages(() => [])
}
