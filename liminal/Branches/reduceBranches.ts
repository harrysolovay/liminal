import type { ActionReducer } from "../Action/ActionReducer.js"
import { reduceActor } from "../Actor/reduceActor.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"
import type { Branches } from "./Branches.js"

export const reduceBranches: ActionReducer<Branches> = async (state, action) => {
  const branchKeys = Reflect.ownKeys(action.branches)
  state.events.emit({
    event: "BranchesEnter",
    branches: action.key,
  })
  const branchStates = await Promise.all(
    branchKeys.map(async (key) => {
      state.events.emit({
        event: "BranchEnter",
        branches: action.key,
        branch: key,
      })
      const childState = await reduceActor({
        kind: "Branch",
        key,
        models: state.models,
        model: { ...state.model },
        actor: unwrapDeferred(action.branches[key as never]!),
        next: undefined,
        events: state.events.child((inner) => ({
          event: "BranchInner",
          branches: action.key,
          branch: key,
          inner,
        })),
        messages: [...state.messages],
        tools: new Set(state.tools),
        children: [],
        result: undefined,
      })
      state.events.emit({
        event: "BranchExit",
        branches: action.key,
        branch: key,
        result: childState.result,
      })
      return childState
    }),
  )
  const result = Array.isArray(action.branches)
    ? branchStates.map((state) => state.result)
    : Object.fromEntries(branchKeys.map((key, i) => [key, branchStates[i]!.result]))
  state.events.emit({
    event: "BranchesExit",
    branches: action.key,
    result,
  })
  return {
    ...state,
    next: result,
    children: [...state.children, ...branchStates],
  }
}
