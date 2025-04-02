import type { ActionReducer } from "../Action/ActionReducer.ts"
import { reduceActor } from "../Actor/reduceActor.ts"
import type { Context } from "../Context/Context.ts"
import { Scope } from "../Scope/Scope.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"

export const reduceContext: ActionReducer<Context> = async (action, scope) => {
  const actor = unwrapDeferred(action.implementation)
  const events = scope.events.child((event) => ({
    type: "context",
    context: action.key,
    event,
  }))
  events.emit({
    type: "entered",
  })
  const contextScope = await reduceActor(
    actor,
    new Scope(
      scope.args,
      action.key,
      events,
      scope.infer,
      scope.embed,
    ),
  )
  events.emit({
    type: "exited",
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
