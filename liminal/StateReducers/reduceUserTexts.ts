import type { StateReducers } from "./StateReducers.js"
import type { Message } from "../Message.js"

export const reduceUserTexts: StateReducers["reduceUserTexts"] = (state, action) => {
  for (const text of action) {
    state.handler({
      event: "UserMessage",
      text,
    })
  }
  const messages = action.map(
    (content) =>
      ({
        role: "user",
        content,
      }) satisfies Message,
  )
  return {
    ...state,
    messages: [...state.messages, ...messages],
    next: undefined,
  }
}
