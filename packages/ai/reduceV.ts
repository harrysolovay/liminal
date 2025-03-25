import { embed } from "ai"
import { _util, type ProviderReducers } from "liminal"
import type { AIExecSpec } from "./AIExecSpec.js"

export const reduceV: ProviderReducers<AIExecSpec>["reduceV"] = async (state, action) => {
  const { languageModelKey: modelKey } = state
  const model = state.config.models.embedding[modelKey]
  _util.assert(model)
  const { embedding } = await embed({
    model,
    value: action.value,
  })
  return {
    ...state,
    next: embedding,
  }
}
