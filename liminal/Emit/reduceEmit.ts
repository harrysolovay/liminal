import type { ActionReducer } from "../Action/ActionReducer.js"
import type { Emit } from "./Emit.js"

export const reduceEmit: ActionReducer<Emit> = (scope, action) => {
  scope.events.emit({
    type: "emitted",
    key: action.key,
    value: action.value,
  })
  return scope.spread({
    next: undefined,
  })
}
