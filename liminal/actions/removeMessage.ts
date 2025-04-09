import { Action } from "../Action.ts"
import type { MessageRemoved } from "../events/MessageRemoved.ts"
import type { Message } from "../Message.ts"
import type { Spec } from "../Spec.ts"

export interface removeMessage extends Action<"remove_message", Spec.Make<{ Event: MessageRemoved }>> {}

export function* removeMessage(message: Message): Generator<removeMessage, void> {
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
