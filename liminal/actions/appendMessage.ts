import { Action } from "../Action.ts"
import type { MessageAppended } from "../events/MessageAppended.ts"
import type { Message, MessageContents, MessageRole, Messages } from "../Message.ts"
import type { MakeSpec } from "../Spec.ts"
import { removeMessage } from "./removeMessage.ts"

export interface appendMessage<M extends Message>
  extends Action<"append_message", MakeSpec<{ Event: MessageAppended<M> }>>
{}

export function* appendMessage<R extends MessageRole>(
  role: R,
  content: MessageContents[R],
): Generator<appendMessage<Messages[R]>, Generator<removeMessage, void>> {
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
