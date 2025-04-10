import { Action } from "../Action.ts"
import type { MessageAppended } from "../events/MessageAppended.ts"
import type { MessageRemoved } from "../events/MessageRemoved.ts"
import type { Message, MessageContents, MessageRole, Messages } from "../Message.ts"
import type { Spec } from "../Spec.ts"
import { peekLast } from "../util/peekLast.ts"

export interface appendMessage<M extends Message = Message>
  extends Action<"append_message", Spec.Make<{ Event: MessageAppended<M> }>>
{}

export interface removeMessage extends Action<"remove_message", Spec.Make<{ Event: MessageRemoved }>> {}

export function* appendMessage<R extends MessageRole>(
  role: R,
  content: MessageContents[R],
): Generator<appendMessage<Messages[R]>, Generator<removeMessage, void>> {
  return yield Action("append_message", (scope) => {
    const message = {
      role,
      content,
    } as Messages[R] // <-- why isn't this inferred?
    const section = peekLast(scope.sections)
    if (section) {
      section.messages.add(message)
    }
    scope.event({
      type: "message_appended",
      message,
    })
    return {
      ...scope,
      nextArg: (function*(): Generator<removeMessage> {
        return yield Action("remove_message", (scope) => {
          scope.event({
            type: "message_removed",
            message,
          })
          const messages = new Set(scope.messages)
          messages.delete(message)
          if (section) {
            section.messages.delete(message)
          }
          return {
            ...scope,
            nextArg: message,
            messages,
          }
        })
      })(),
      messages: new Set([...scope.messages, message]),
    }
  })
}
