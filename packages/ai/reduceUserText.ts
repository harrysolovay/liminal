import type { CoreMessage } from "ai"
import type { ProviderReducers } from "liminal"
import type { AIExecSpec } from "./AIExecSpec.js"

export const reduceUserText: ProviderReducers<AIExecSpec>["reduceUserText"] = (state, action) => {
  state.handler({
    type: "UserText",
    text: action,
  })
  return {
    ...state,
    messages: [
      ...state.messages,
      {
        role: "user",
        content: action,
      } satisfies CoreMessage,
    ],
    next: undefined,
  }
}
