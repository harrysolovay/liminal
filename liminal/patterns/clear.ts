import type { Action } from "../Action.ts"
import { setMessages } from "../actions/setMessages.ts"
import type { MessagesSetEvent } from "../events/MessagesSetEvent.ts"
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
