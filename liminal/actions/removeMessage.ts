import { Action } from "../Action.ts"
import type { MessageRemoved } from "../events/MessageRemoved.ts"
import type { Message } from "../Message.ts"

export function* removeMessage(message: Message): Generator<
  Action<"remove_message", {
    Event: MessageRemoved
    Child: never
    Entry: never
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
