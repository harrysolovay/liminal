import type { ActionReducer } from "../../Action/ActionReducer.ts"
import type { SystemMessage } from "./SystemMessage.ts"

export const reduceSystemMessage: ActionReducer<SystemMessage> = (action, scope) => {
  scope.events.emit({
    type: "system_messaged",
    content: action.content,
  })
  return scope.spread({
    messages: [...scope.messages, action],
    next: undefined,
  })
}
