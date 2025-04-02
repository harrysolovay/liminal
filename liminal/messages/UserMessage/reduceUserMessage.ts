import type { ActionReducer } from "../../Action/ActionReducer.ts"
import type { UserMessage } from "./UserMessage.ts"

export const reduceUserMessage: ActionReducer<UserMessage> = (action, scope) => {
  scope.events.emit({
    type: "user_messaged",
    content: action.content,
  })
  return scope.spread({
    messages: [...scope.messages, action],
    next: undefined,
  })
}
