import type { CoreMessage, LanguageModelV1 } from "ai"
import type { ProviderReducers } from "liminal"

export const reduceUserTexts: ProviderReducers<LanguageModelV1, CoreMessage>["reduceUserTexts"] = (state, action) => {
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
