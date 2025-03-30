import type { ActionReducer } from "../Action/ActionReducer.js"
import { reduceActor } from "../Actor/reduceActor.js"
import { State } from "../State/State.js"
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
      const branchState = await reduceActor(
        new State(
          state.models,
          key,
          unwrapDeferred(action.branches[key as never]!),
          state.events.child((inner) => ({
            event: "BranchInner",
            branches: action.key,
            branch: key,
            inner,
          })),
          state.model,
          [...state.messages],
          new Set(state.tools),
        ),
      )
      state.events.emit({
        event: "BranchExit",
        branches: action.key,
        branch: key,
        result: branchState.result,
      })
      return [key, branchState] as const
    }),
  )
  const result = Array.isArray(action.branches)
    ? branchStates.map(([_0, state]) => state.result)
    : Object.fromEntries(branchStates.map(([key, value]) => [key, value.result]))
  state.events.emit({
    event: "BranchesExit",
    branches: action.key,
    result,
  })
  return state.spread({
    next: result,
    children: [...state.children, {
      kind: "Branches",
      key: action.key,
      states: Object.fromEntries(branchStates),
    }],
  })
}
