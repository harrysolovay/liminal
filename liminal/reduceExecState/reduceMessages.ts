import type { ActionReducers } from "./ActionReducers.js"

export const reduceMessages: ActionReducers["reduceMessages"] = (state, action) => {
  return {
    ...state,
    next: [...state.messages],
  }
}
