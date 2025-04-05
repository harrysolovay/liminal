import type { Message } from "../Message.ts"
import type { Spec } from "../Spec.ts"
import { ActionBase, type EventBase } from "./actions_base.ts"

export interface AppendMessage<S extends Spec = Spec> extends ActionBase<"append_message", S> {
  message: Message
}

export interface MessageAppendedEvent<M extends Message = Message> extends EventBase<"message_appended"> {
  message: M
}

export function* appendMessage<M extends Message>(message: M): Generator<
  AppendMessage<{
    Entry: never
    Event: MessageAppendedEvent<M>
  }>,
  void
> {
  yield ActionBase("append_message", {
    message,
    reduce(scope) {
      scope.events.emit({
        type: "message_appended",
        message,
      })
      return scope.spread({
        next: undefined,
        messages: [...scope.messages, message],
      })
    },
  })
}
