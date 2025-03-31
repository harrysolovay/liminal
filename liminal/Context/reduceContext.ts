import type { ActionReducer } from "../Action/ActionReducer.ts"
import { reduceActor } from "../Actor/reduceActor.ts"
import type { Context } from "../Context/Context.ts"
import { Scope } from "../Scope/Scope.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"

export const reduceContext: ActionReducer<Context> = async (scope, action) => {
  scope.events.emit({
    type: "context_entered",
    context: action.key,
  })
  const contextScope = await reduceActor(
    new Scope(
      scope.models,
      action.key,
      unwrapDeferred(action.implementation),
      scope.events.child((inner) => ({
        type: "context_inner",
        context: action.key,
        inner,
      })),
      { ...scope.model },
    ),
  )
  scope.events.emit({
    type: "context_exited",
    context: action.key,
    result: contextScope.result,
  })
  return scope.spread({
    next: contextScope.result,
    children: [...scope.children, {
      type: "context",
      scope: contextScope,
    }],
  })
}
