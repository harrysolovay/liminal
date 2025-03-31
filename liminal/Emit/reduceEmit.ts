import type { ActionReducer } from "../Action/ActionReducer.ts"
import type { Emit } from "./Emit.ts"

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
