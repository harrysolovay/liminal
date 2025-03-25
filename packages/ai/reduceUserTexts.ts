import type { CoreMessage } from "ai"
import type { ProviderReducers } from "liminal"
import type { AIExecSpec } from "./AIExecSpec.js"

export const reduceUserTexts: ProviderReducers<AIExecSpec>["reduceUserTexts"] = (state, action) => {
  for (const text of action) {
    state.handler({
      type: "UserText",
      text,
    })
  }
  const messages = action.map(
    (content) =>
      ({
        role: "user",
        content,
      }) satisfies CoreMessage,
  )
  return {
    ...state,
    messages: [...state.messages, ...messages],
    next: undefined,
  }
}
