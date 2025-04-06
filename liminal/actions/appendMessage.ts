import { Action } from "../Action.ts"
import type { MessageAppendedEvent } from "../events/MessageAppendedEvent.ts"
import type { MessageRemovedEvent } from "../events/MessageRemovedEvent.ts"
import type { Message } from "../Message.ts"
import { removeMessage } from "./removeMessage.ts"

export function* appendMessage<M extends Message>(message: M): Generator<
  Action<"append_message", {
    Entry: never
    Event: MessageAppendedEvent<M>
    Throw: never
  }>,
  Generator<
    Action<"remove_message", {
      Entry: never
      Event: MessageRemovedEvent
      Throw: never
    }>,
    void
  >
> {
  return yield Action("append_message", (scope) => {
    scope.event({
      type: "message_appended",
      message,
    })
    return {
      ...scope,
      nextArg: removeMessage(message),
      messages: new Set([...scope.messages, message]),
    }
  })
}
