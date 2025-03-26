import type { Message } from "../Message.js"
import type { StateReducers } from "./StateReducers.js"

export const reduceUserText: StateReducers["reduceUserText"] = (state, action) => {
  state.handler({
    event: "UserMessage",
    text: action,
  })
  return {
    ...state,
    messages: [
      ...state.messages,
      {
        role: "user",
        content: action,
      } satisfies Message,
    ],
    next: undefined,
  }
}
