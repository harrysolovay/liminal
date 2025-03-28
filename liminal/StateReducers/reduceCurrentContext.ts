import type { StateReducers } from "./StateReducers.js"

export const reduceCurrentContext: StateReducers["reduceCurrentContext"] = (state) => {
  return {
    ...state,
    next: [...state.messages],
  }
}
