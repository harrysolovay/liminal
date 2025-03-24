import type { ActionReducers } from "./ActionReducers.js"

export const reduceEmit: ActionReducers["reduceEmit"] = (state, action) => {
  state.handler({
    type: "Emit",
    event: action.key,
    value: action.value,
  })
  return {
    ...state,
    next: undefined,
  }
}
