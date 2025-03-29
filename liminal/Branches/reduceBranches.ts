import type { ActionReducer } from "../Action/ActionReducer.js"
import { reduceActor } from "../Actor/reduceActor.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"
import type { Value } from "../util/Value.js"
import type { Branches, BranchImplementations } from "./Branches.js"

export const reduceBranches: ActionReducer<Branches> = async (state, action) => {
  const branchesKeys = Object.keys(action.branches)
  state.events.emit({
    event: "BranchesEnter",
    branches: branchesKeys,
  })
  const branchStates = await Promise.all(
    branchesKeys.map(async (key) => {
      state.events.emit({
        event: "BranchEnter",
        branch: key,
      })
      const source = (action.branches as any)[key] as Value<BranchImplementations>
      const childState = await reduceActor({
        kind: "Branch",
        key,
        config: state.config,
        model: { ...state.model },
        system: state.system,
        actor: unwrapDeferred(source),
        next: undefined,
        events: state.events.child((inner) => ({
          event: "BranchInner",
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
        branch: key,
        result: childState.result,
      })
      return childState
    }),
  )
  const result = Array.isArray(action.branches)
    ? branchStates.map((state) => state.result)
    : Object.fromEntries(branchesKeys.map((key, i) => [key, branchStates[i]!.result]))
  state.events.emit({
    event: "BranchesExit",
    branches: branchesKeys,
    result,
  })
  return {
    ...state,
    next: result,
    children: [...state.children, ...branchStates],
  }
}
