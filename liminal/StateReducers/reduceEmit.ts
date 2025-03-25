import type { StateReducers } from "./StateReducers.js"

export const reduceEmit: StateReducers["reduceEmit"] = (state, action) => {
  state.handler({
    type: "Emit",
    key: action.key,
    value: action.value,
  })
  return {
    ...state,
    next: undefined,
  }
}
