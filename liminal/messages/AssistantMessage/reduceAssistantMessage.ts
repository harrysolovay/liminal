import type { ActionReducer } from "../../Action/ActionReducer.ts"
import type { AssistantMessage } from "./AssistantMessage.ts"

export const reduceAssistantMessage: ActionReducer<AssistantMessage> = (action, scope) => {
  scope.events.emit({
    type: "assistant_messaged",
    content: action.content,
  })
  return scope.spread({
    messages: [...scope.messages, action],
    next: undefined,
  })
}
