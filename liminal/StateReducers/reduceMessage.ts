import type { StateReducers } from "./StateReducers.js"
import { normalizeMessageLike } from "../Message.js"

export const reduceMessage: StateReducers["reduceMessage"] = (state, action) => {
  const message = normalizeMessageLike(action)
  state.handler({
    event: "Message",
    message,
  })
  return {
    ...state,
    messages: [...state.messages, message],
    next: undefined,
  }
}
