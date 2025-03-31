import type { ActionReducer } from "../Action/ActionReducer.ts"
import type { Message } from "./Message.ts"

export const reduceMessage: ActionReducer<Message> = (scope, message) => {
  scope.events.emit({
    event: message.action,
    content: message.content,
  } as never)
  return scope.spread({
    messages: [...scope.messages, message],
    next: undefined,
  })
}
