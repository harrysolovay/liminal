import { type MessagesSetEvent, type SetMessages, setMessages } from "../actions/SetMessages.ts"

export function clear(): Generator<
  SetMessages<{
    Entry: never
    Event: MessagesSetEvent
  }>,
  void
> {
  return setMessages(() => [])
}
