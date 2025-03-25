import type { StateReducers } from "./StateReducers.js"

export const reduceMessages: StateReducers["reduceMessages"] = (state) => {
  return {
    ...state,
    next: [...state.messages],
  }
}
