import { Action } from "../Action.ts"
import type {
  Actor,
  ActorLike,
  ActorLikeArray,
  ActorLikeRecord,
  ActorLikesT,
  ActorLikeT,
  ActorLikeY,
} from "../Actor.ts"
import type { ActorLikes } from "../Actor.ts"
import type { Spec } from "../Spec.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"

export function branch<
  K extends JSONKey,
  Y extends Action,
  T,
>(
  key: K,
  actorLike: ActorLike<Y, T>,
): Generator<
  Action<
    "branch",
    Spec.Make<{
      Child: [Y[""]] extends [never] ? never : [K, Y[""]]
      Entry: Y[""]["Entry"]
      Value: T
    }>
  >,
  T
>
export function branch<K extends JSONKey, const A extends ActorLikeArray>(name: K, actorLikeArray: A): Generator<
  Action<
    "branch",
    Spec.Make<{
      Child: [
        K,
        {
          [L in keyof A]: Spec.Make<{
            Child: [L, ActorLikeY<A[L]>[""]]
            Entry: ActorLikeY<A[L]>[""]["Entry"]
            Value: ActorLikeT<A[L]>
          }>
        }[keyof A],
      ]
      Entry: ActorLikeY<A[number]>[""]["Entry"]
    }>
  >,
  ActorLikesT<A>
>
export function branch<K extends JSONKey, A extends ActorLikeRecord>(name: K, actorLikeRecord: A): Generator<
  Action<
    "branch",
    Spec.Make<{
      Child: [
        K,
        {
          [L in Exclude<keyof A, symbol>]: Spec.Make<{
            Child: [L, ActorLikeY<A[L]>[""]]
            Entry: ActorLikeY<A[L]>[""]["Entry"]
            Value: ActorLikeT<A[L]>
          }>
        }[Exclude<keyof A, symbol>],
      ]
      Entry: ActorLikeY<A[keyof A]>[""]["Entry"]
    }>
  >,
  ActorLikesT<A>
>
export function* branch(key: JSONKey, implementation: ActorLike | ActorLikes): Generator<Action<"branch">, any> {
  return yield Action("branch", async (scope) => {
    if (typeof implementation === "function") {
      const branchScope = scope.fork("branch", [key])
      const actor = unwrapDeferred(implementation as ActorLike)
      const { value } = await branchScope.reduce(actor)
      branchScope.event({
        type: "returned",
        value,
      })
      return {
        ...scope,
        nextArg: value,
      }
    }
    const armKeys = Array.isArray(implementation)
      ? Array.from({ length: implementation.length }, (_0, i) => i)
      : Reflect.ownKeys(implementation) as Array<string>
    const values = await Promise.all(armKeys.map(async (armKey) => {
      const branchArmScope = scope.fork("branch_arm", [key, armKey])
      const actor = unwrapDeferred(implementation[armKey as never]) as Actor
      const { value } = await branchArmScope.reduce(actor)
      branchArmScope.event({
        type: "returned",
        value,
      })
      return value
    }))
    const value = Array.isArray(implementation)
      ? values
      : Object.fromEntries(armKeys.map((key, i) => [key, values[i]]))
    return {
      ...scope,
      nextArg: value,
    }
  })
}
