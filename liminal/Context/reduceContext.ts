import type { Context } from "../Context/Context.js"
import { Generation } from "../Generation/Generation.js"
import type { Tool } from "../Tool/Tool.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"
import type { ActionReducer } from "../Action/ActionReducer.js"
import { reduceActor } from "../Actor/reduceActor.js"

export const reduceContext: ActionReducer<Context> = async (state, action) => {
  state.events.emit({
    event: "ContextEnter",
    context: action.key,
    system: action.system,
  })
  const contextState = await reduceActor({
    kind: "Context",
    key: action.key,
    config: state.config,
    actor: action.implementation ? unwrapDeferred(action.implementation) : Generation(),
    model: { ...state.model },
    system: action.system,
    next: undefined,
    messages: [],
    tools: new Set<Tool>(),
    events: state.events.child((inner) => ({
      event: "ContextInner",
      context: action.key,
      inner,
    })),
    children: [],
    result: undefined,
  })
  state.events.emit({
    event: "ContextExit",
    context: action.key,
    result: contextState.result,
  })
  return {
    ...state,
    next: contextState.result,
    children: [...state.children, contextState],
  }
}
