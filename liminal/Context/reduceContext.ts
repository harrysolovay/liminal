import type { ActionReducer } from "../Action/ActionReducer.js"
import { reduceActor } from "../Actor/reduceActor.js"
import type { Context } from "../Context/Context.js"
import { Inference } from "../Inference/Inference.js"
import { Scope } from "../Scope/Scope.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"

export const reduceContext: ActionReducer<Context> = async (scope, action) => {
  scope.events.emit({
    type: "ContextEnter",
    context: action.key,
  })
  const contextScope = await reduceActor(
    new Scope(
      scope.models,
      action.key,
      action.implementation
        ? "~standard" in action.implementation
          ? Inference(action.implementation)
          : unwrapDeferred(action.implementation)
        : Inference(),
      scope.events.child((inner) => ({
        type: "ContextInner",
        context: action.key,
        inner,
      })),
      { ...scope.model },
    ),
  )
  scope.events.emit({
    type: "ContextExit",
    context: action.key,
    result: contextScope.result,
  })
  return scope.spread({
    next: contextScope.result,
    children: [...scope.children, {
      type: "Context",
      scope: contextScope,
    }],
  })
}
