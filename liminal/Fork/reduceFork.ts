import type { ActionReducer } from "../Action/ActionReducer.ts"
import { reduceActor } from "../Actor/reduceActor.ts"
import { Scope } from "../Scope/Scope.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"
import type { Fork } from "./Fork.ts"

export const reduceFork: ActionReducer<Fork> = async (scope, action) => {
  const armKeys = Array.isArray(action.arms)
    ? Array.from({ length: action.arms.length }, (_0, i) => i)
    : Reflect.ownKeys(action.arms)
  scope.events.emit({
    type: "fork_entered",
    fork: action.key,
  })
  const armScopes = await Promise.all(
    armKeys.map(async (key) => {
      scope.events.emit({
        type: "fork_arm_entered",
        fork: action.key,
        arm: key,
      })
      const armScope = await reduceActor(
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
        result: armScope.result,
      })
      return [key, armScope] as const
    }),
  )
  const result = Array.isArray(action.arms)
    ? armScopes.map(([_0, scope]) => scope.result)
    : Object.fromEntries(armScopes.map(([key, value]) => [key, value.result]))
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
      scopes: Object.fromEntries(armScopes),
    }],
  })
}
