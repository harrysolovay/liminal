import { Action } from "../Action.ts"
import type { MessageRemovedEvent } from "../events/MessageRemovedEvent.ts"
import type { Message } from "../Message.ts"

export function* removeMessage<M extends Message>(message: M): Generator<
  Action<"remove_message", {
    Entry: never
    Event: MessageRemovedEvent
    Throw: never
  }>,
  void
> {
  yield Action("remove_message", (scope) => {
    scope.event({
      type: "message_removed",
      message,
    })
    const messages = new Set(scope.messages)
    messages.delete(message)
    return {
      ...scope,
      nextArg: message,
      messages,
    }
  })
}
