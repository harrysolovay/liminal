import type { ActionReducer } from "../Action/ActionReducer.js"
import type { CurrentState } from "./CurrentState.js"

export const reduceCurrentState: ActionReducer<CurrentState> = (state) => {
  return {
    ...state,
    next: state,
  }
}
