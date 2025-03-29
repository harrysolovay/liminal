import type { CurrentState } from "../Action/CurrentState.js"
import type { ActionReducer } from "./ActionReducer.js"

export const reduceCurrentState: ActionReducer<CurrentState> = (state) => {
  return {
    ...state,
    next: state,
  }
}
