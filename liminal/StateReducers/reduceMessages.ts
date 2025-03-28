import type { StateReducers } from "./StateReducers.js"
import { normalizeMessageLike } from "../Message.js"

export const reduceMessages: StateReducers["reduceMessages"] = (state, action) => {
  const messages = action.map(normalizeMessageLike)
  for (const message of messages) {
    state.handler({
      event: "Message",
      message,
    })
  }
  return {
    ...state,
    messages: [...state.messages, ...messages],
    next: undefined,
  }
}
