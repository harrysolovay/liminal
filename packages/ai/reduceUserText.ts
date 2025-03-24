import type { CoreMessage, LanguageModelV1 } from "ai"
import type { ProviderReducers } from "liminal"

export const reduceUserText: ProviderReducers<LanguageModelV1, CoreMessage>["reduceUserText"] = (state, action) => {
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
