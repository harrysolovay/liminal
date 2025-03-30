import type { ActionReducer } from "../Action/ActionReducer.js"
import type { Emission } from "./Emission.js"

export const reduceEmission: ActionReducer<Emission> = (scope, action) => {
  scope.events.emit({
    event: "Emission",
    key: action.key,
    value: action.value,
  })
  return scope.spread({
    next: undefined,
  })
}
