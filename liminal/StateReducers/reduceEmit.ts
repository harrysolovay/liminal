import type { StateReducers } from "./StateReducers.js"

export const reduceEmit: StateReducers["reduceEmit"] = (state, action) => {
  state.events.emit({
    event: "Emit",
    key: action.key,
    value: action.value,
  })
  return {
    ...state,
    next: undefined,
  }
}
