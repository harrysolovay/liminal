import type { ActionReducers } from "./ActionReducers.js"

export const reduceModel: ActionReducers["reduceModel"] = (state, action) => {
  state.handler({
    type: "Model",
    model: action.key,
  })
  return {
    ...state,
    modelKey: action.key,
    next: undefined,
  }
}
