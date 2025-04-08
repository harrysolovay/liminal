import { Action } from "../Action.ts"
import type { MessageAppended } from "../events/MessageAppended.ts"
import type { MessageRemoved } from "../events/MessageRemoved.ts"
import type { Message, MessageContents, MessageRole, Messages } from "../Message.ts"
import { removeMessage } from "./removeMessage.ts"

export function* appendMessage<R extends MessageRole>(role: R, content: MessageContents[R]): Generator<
  Action<"append_message", {
    Event: MessageAppended<Messages[R]>
    Child: never
    Entry: never
    Throw: never
  }>,
  Generator<
    Action<"remove_message", {
      Event: MessageRemoved
      Child: never
      Entry: never
      Throw: never
    }>,
    void
  >
> {
  return yield Action("append_message", (scope) => {
    const message = {
      role,
      content,
    } as Messages[R] // <-- why isn't this inferred?
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
