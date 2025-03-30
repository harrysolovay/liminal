import type { ActionReducer } from "../Action/ActionReducer.js"
import type { Emit } from "./Emit.js"

export const reduceEmit: ActionReducer<Emit> = (state, action) => {
  state.events.emit({
    event: "Emit",
    key: action.key,
    value: action.value,
  })
  return state.spread({
    next: undefined,
  })
}
