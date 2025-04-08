import { Action } from "../Action.ts"
import type { MessageAppended } from "../events/MessageAppended.ts"
import type { MessageRemoved } from "../events/MessageRemoved.ts"
import type { MessageContents, MessageRole, Messages } from "../Message.ts"
import type { MakeSpec } from "../Spec.ts"
import { removeMessage } from "./removeMessage.ts"

export function* appendMessage<R extends MessageRole>(role: R, content: MessageContents[R]): Generator<
  Action<
    "append_message",
    MakeSpec<{
      Event: MessageAppended<Messages[R]>
    }>
  >,
  Generator<
    Action<
      "remove_message",
      MakeSpec<{
        Event: MessageRemoved
      }>
    >,
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
