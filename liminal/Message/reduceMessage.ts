import type { ActionReducer } from "../Action/ActionReducer.ts"
import type { Message } from "./Message.ts"

export const reduceMessage: ActionReducer<Message> = (action, scope) => {
  // TODO: fix this
  scope.events.emit({
    type: action.action,
    content: action.content,
  } as never)
  return scope.spread({
    messages: [...scope.messages, action],
    next: undefined,
  })
}
