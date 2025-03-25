import type { StateReducers } from "./StateReducers.js"

export const reduceModel: StateReducers["reduceModel"] = (state, action) => {
  state.handler({
    type: "Model",
    key: action.key,
  })
  return {
    ...state,
    modelKey: action.key,
    next: undefined,
  }
}
