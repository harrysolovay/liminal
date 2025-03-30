import type { ActionReducer } from "../Action/ActionReducer.js"
import type { CurrentScope } from "./CurrentScope.js"

export const reduceCurrentScope: ActionReducer<CurrentScope> = (scope) => {
  return scope.spread({
    next: scope,
  })
}
