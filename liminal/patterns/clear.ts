import type { Action } from "../Action.ts"
import { type MessagesSetEvent, setMessages } from "../actions/SetMessages.ts"
import type { Message } from "../Message.ts"

export function clear(): Generator<
  Action<"set_messages", {
    Entry: never
    Event: MessagesSetEvent
    Throw: never
  }>,
  Array<Message>
> {
  return setMessages(() => [])
}
