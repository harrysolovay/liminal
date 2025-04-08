import { Action } from "../Action.ts"
import type { Actor, ActorLike, ActorLikeArray, ActorLikeRecord, ActorLikesT, ActorLikeY } from "../Actor.ts"
import type { ActorLikes } from "../Actor.ts"
import type { MakeSpec, Spec } from "../Spec.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"

export interface branch<
  K extends JSONKey,
  ChildSpec extends Spec,
  Entry extends Spec["Entry"],
> extends
  Action<
    "branch",
    MakeSpec<{
      Child: [K, ChildSpec]
      Entry: Entry
    }>
  >
{}

export function branch<
  K extends JSONKey,
  Y extends Action,
  T,
>(
  key: K,
  actorLike: ActorLike<Y, T>,
): Generator<branch<K, Y[""], Y[""]["Entry"]>, T>
export function branch<K extends JSONKey, const A extends ActorLikeArray>(name: K, actorLikeArray: A): Generator<
  branch<
    K,
    {
      [L in keyof A]: MakeSpec<{
        Child: [L, ActorLikeY<A[L]>[""]]
        Entry: ActorLikeY<A[L]>[""]["Entry"]
      }>
    }[keyof A],
    ActorLikeY<A[number]>[""]["Entry"]
  >,
  ActorLikesT<A>
>
export function branch<K extends JSONKey, A extends ActorLikeRecord>(name: K, actorLikeRecord: A): Generator<
  branch<
    K,
    {
      [L in Exclude<keyof A, symbol>]: MakeSpec<{
        Child: [L, ActorLikeY<A[L]>[""]]
        Entry: ActorLikeY<A[L]>[""]["Entry"]
      }>
    }[Exclude<keyof A, symbol>],
    ActorLikeY<A[keyof A]>[""]["Entry"]
  >,
  ActorLikesT<A>
>
export function* branch(key: JSONKey, implementation: ActorLike | ActorLikes): Generator<Action<"branch">, any> {
  return yield Action("branch", async (scope) => {
    if (typeof implementation === "function") {
      const branchScope = scope.fork("branch", [key])
      const actor = unwrapDeferred(implementation as ActorLike)
      const { value } = await branchScope.reduce(actor)
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
