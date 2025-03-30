import type { ActionReducer } from "../Action/ActionReducer.js"
import type { Message } from "./Message.js"

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
