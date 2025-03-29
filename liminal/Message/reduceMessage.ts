import type { Message } from "./Message.js"
import type { ActionReducer } from "../Action/ActionReducer.js"

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
