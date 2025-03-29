import { Generation } from "../Action/Generation.js"
import type { Tool } from "../Action/Tool.js"
import { ExecState } from "../ExecState.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"
import { reduceActor } from "./reduceActor.js"
import type { StateReducers } from "./StateReducers.js"

export const reduceContext: StateReducers["reduceContext"] = async function (state, action) {
  state.events.emit({
    event: "ContextEnter",
    context: action.key,
    system: action.system,
  })
  const contextState = await reduceActor(this, {
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
