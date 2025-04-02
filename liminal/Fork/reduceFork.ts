import type { ActionReducer } from "../Action/ActionReducer.ts"
import { reduceActor } from "../Actor/reduceActor.ts"
import { Scope } from "../Scope/Scope.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"
import type { Fork } from "./Fork.ts"

export const reduceFork: ActionReducer<Fork> = async (action, scope) => {
  const armKeys = Array.isArray(action.arms)
    ? Array.from({ length: action.arms.length }, (_0, i) => i)
    : Reflect.ownKeys(action.arms)
  const events = scope.events.child((event) => ({
    type: "fork",
    fork: action.key,
    event,
  }))
  events.emit({
    type: "entered",
  })
  const armScopes = await Promise.all(
    armKeys.map(async (key) => {
      const armEvents = events.child((event) => ({
        type: "fork_arm",
        arm: key,
        event,
      }))
      armEvents.emit({
        type: "entered",
      })
      const actor = unwrapDeferred(action.arms[key as never]!)
      const armScope = await reduceActor(
        actor,
        new Scope(
          scope.args,
          key,
          armEvents,
          scope.infer,
          scope.embed,
          [...scope.messages],
          new Set(scope.tools),
        ),
      )
      armEvents.emit({
        type: "exited",
        result: armScope.result,
      })
      return [key, armScope] as const
    }),
  )
  const result = Array.isArray(action.arms)
    ? armScopes.map(([_0, scope]) => scope.result)
    : Object.fromEntries(armScopes.map(([key, value]) => [key, value.result]))
  events.emit({
    type: "exited",
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
