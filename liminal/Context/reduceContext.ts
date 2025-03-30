import type { ActionReducer } from "../Action/ActionReducer.js"
import { reduceActor } from "../Actor/reduceActor.js"
import type { Context } from "../Context/Context.js"
import { Generation } from "../Generation/Generation.js"
import { State } from "../State/State.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"

export const reduceContext: ActionReducer<Context> = async (state, action) => {
  state.events.emit({
    event: "ContextEnter",
    context: action.key,
  })
  const contextState = await reduceActor(
    new State(
      state.models,
      action.key,
      action.implementation
        ? "~standard" in action.implementation
          ? Generation(action.implementation)
          : unwrapDeferred(action.implementation)
        : Generation(),
      state.events.child((inner) => ({
        event: "ContextInner",
        context: action.key,
        inner,
      })),
      { ...state.model },
    ),
  )
  state.events.emit({
    event: "ContextExit",
    context: action.key,
    result: contextState.result,
  })
  return state.spread({
    next: contextState.result,
    children: [...state.children, {
      kind: "Context",
      state: contextState,
    }],
  })
}
