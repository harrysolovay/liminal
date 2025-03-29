import type { CurrentState } from "./CurrentState.js"
import type { ActionReducer } from "../Action/ActionReducer.js"

export const reduceCurrentState: ActionReducer<CurrentState> = (state) => {
  return {
    ...state,
    next: state,
  }
}
