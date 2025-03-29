import type { Emit } from "../Action/Emit.js"
import type { ActionReducer } from "./ActionReducer.js"

export const reduceEmit: ActionReducer<Emit> = (state, action) => {
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
