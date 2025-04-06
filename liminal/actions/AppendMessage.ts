import { Action, type EventBase } from "../Action.ts"
import type { Message } from "../Message.ts"

export function* appendMessage<M extends Message>(message: M): Generator<
  Action<"append_message", {
    Entry: never
    Event: MessageAppendedEvent<M>
    Throw: never
  }>,
  void
> {
  yield Action<never>()("append_message", (scope) => {
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

export interface MessageAppendedEvent<M extends Message = Message> extends EventBase<"message_appended"> {
  message: M
}
