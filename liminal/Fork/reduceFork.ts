import type { ActionReducer } from "../Action/ActionReducer.ts"
import { reduceActor } from "../Actor/reduceActor.ts"
import { Scope } from "../Scope/Scope.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"
import type { Fork } from "./Fork.ts"

export const reduceFork: ActionReducer<Fork> = async (scope, action) => {
  const branchKeys = Reflect.ownKeys(action.arms)
  scope.events.emit({
    type: "fork_entered",
    fork: action.key,
  })
  const branchScopes = await Promise.all(
    branchKeys.map(async (key) => {
      scope.events.emit({
        type: "fork_arm_entered",
        fork: action.key,
        arm: key,
      })
      const branchScope = await reduceActor(
        new Scope(
          scope.models,
          key,
          unwrapDeferred(action.arms[key as never]!),
          scope.events.child((inner) => ({
            type: "fork_arm_inner",
            fork: action.key,
            arm: key,
            event: inner,
          })),
          scope.model,
          [...scope.messages],
          new Set(scope.tools),
        ),
      )
      scope.events.emit({
        type: "fork_arm_exited",
        fork: action.key,
        arm: key,
        result: branchScope.result,
      })
      return [key, branchScope] as const
    }),
  )
  const result = Array.isArray(action.arms)
    ? branchScopes.map(([_0, scope]) => scope.result)
    : Object.fromEntries(branchScopes.map(([key, value]) => [key, value.result]))
  scope.events.emit({
    type: "fork_exited",
    fork: action.key,
    result,
  })
  return scope.spread({
    next: result,
    children: [...scope.children, {
      type: "fork",
      key: action.key,
      scopes: Object.fromEntries(branchScopes),
    }],
  })
}
