import type { ActionReducer } from "../Action/ActionReducer.ts"
import type { Arg } from "./Arg.ts"

export const reduceArg: ActionReducer<Arg> = (action, scope) => {
  return scope.spread({
    next: scope.args[action.key],
  })
}
