import type { ActionReducer } from "../Action/ActionReducer.js"
import { reduceActor } from "../Actor/reduceActor.js"
import { Scope } from "../Scope/Scope.js"
import { unwrapDeferred } from "../util/unwrapDeferred.js"
import type { Branches } from "./Branches.js"

export const reduceBranches: ActionReducer<Branches> = async (scope, action) => {
  const branchKeys = Reflect.ownKeys(action.branches)
  scope.events.emit({
    type: "BranchesEnter",
    branches: action.key,
  })
  const branchScopes = await Promise.all(
    branchKeys.map(async (key) => {
      scope.events.emit({
        type: "BranchEnter",
        branches: action.key,
        branch: key,
      })
      const branchScope = await reduceActor(
        new Scope(
          scope.models,
          key,
          unwrapDeferred(action.branches[key as never]!),
          scope.events.child((inner) => ({
            type: "BranchInner",
            branches: action.key,
            branch: key,
            inner,
          })),
          scope.model,
          [...scope.messages],
          new Set(scope.tools),
        ),
      )
      scope.events.emit({
        type: "BranchExit",
        branches: action.key,
        branch: key,
        result: branchScope.result,
      })
      return [key, branchScope] as const
    }),
  )
  const result = Array.isArray(action.branches)
    ? branchScopes.map(([_0, scope]) => scope.result)
    : Object.fromEntries(branchScopes.map(([key, value]) => [key, value.result]))
  scope.events.emit({
    type: "BranchesExit",
    branches: action.key,
    result,
  })
  return scope.spread({
    next: result,
    children: [...scope.children, {
      type: "Branches",
      key: action.key,
      scopes: Object.fromEntries(branchScopes),
    }],
  })
}
