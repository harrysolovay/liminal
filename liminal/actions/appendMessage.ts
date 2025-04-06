import { Action } from "../Action.ts"
import type { MessageAppendedEvent } from "../events/MessageAppendedEvent.ts"
import type { Message } from "../Message.ts"

export function* appendMessage<M extends Message>(message: M): Generator<
  Action<"append_message", {
    Entry: never
    Event: MessageAppendedEvent<M>
    Throw: never
  }>,
  void
> {
  yield Action("append_message", (scope) => {
    scope.event({
      type: "message_appended",
      message,
    })
    return {
      ...scope,
      nextArg: undefined,
      messages: [...scope.messages, message],
    }
  })
}
