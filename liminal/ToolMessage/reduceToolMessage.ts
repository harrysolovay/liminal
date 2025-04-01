import type { ActionReducer } from "../Action/ActionReducer.ts"
import type { ToolMessage } from "./ToolMessage.ts"

export const reduceToolMessage: ActionReducer<ToolMessage> = (action, scope) => {
  scope.events.emit({
    type: "tool_messaged",
    content: action.content,
  })
  return scope.spread({
    messages: [...scope.messages, action],
    next: undefined,
  })
}
