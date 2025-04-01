import type { ActionReducer } from "../Action/ActionReducer.ts"
import type { GetScope } from "./GetScope.ts"

export const reduceGetScope: ActionReducer<GetScope> = async (_0, scope) => {
  return scope.spread({
    next: scope,
  })
}
