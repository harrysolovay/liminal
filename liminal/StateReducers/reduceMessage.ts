import type { StateReducers } from "./StateReducers.js"

export const reduceMessage: StateReducers["reduceMessage"] = (state, message) => {
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
