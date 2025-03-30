import type { ActionReducer } from "../Action/ActionReducer.js"
import { reduceActor } from "../Actor/reduceActor.js"
import type { Context } from "../Context/Context.js"
import { Generation } from "../Generation/Generation.js"
import { Scope } from "../Scope/Scope.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"

export const reduceContext: ActionReducer<Context> = async (scope, action) => {
  scope.events.emit({
    event: "ContextEnter",
    context: action.key,
  })
  const contextScope = await reduceActor(
    new Scope(
      scope.models,
      action.key,
      action.implementation
        ? "~standard" in action.implementation
          ? Generation(action.implementation)
          : unwrapDeferred(action.implementation)
        : Generation(),
      scope.events.child((inner) => ({
        event: "ContextInner",
        context: action.key,
        inner,
      })),
      { ...scope.model },
    ),
  )
  scope.events.emit({
    event: "ContextExit",
    context: action.key,
    result: contextScope.result,
  })
  return scope.spread({
    next: contextScope.result,
    children: [...scope.children, {
      kind: "Context",
      scope: contextScope,
    }],
  })
}
