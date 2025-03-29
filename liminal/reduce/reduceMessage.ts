import type { Message } from "../Action/Action.js"
import type { ActionReducer } from "./ActionReducer.js"

export const reduceMessage: ActionReducer<Message> = (state, message) => {
  state.events.emit({
    event: message.action,
    content: message.content,
  } as never)
  return {
    ...state,
    messages: [...state.messages, message],
    next: undefined,
  }
}
