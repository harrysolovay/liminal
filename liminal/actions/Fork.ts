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
import { isIteratorLike } from "../util/isIteratorLike.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"
import type { ChildEvent } from "./actions_common.ts"

export function fork<K extends keyof any, Y extends Action, T>(
  key: K,
  actorLike: ActorLike<Y, T>,
): Generator<
  Action<"fork", {
    Entry: Y[""]["Entry"]
    Event: ChildEvent<"fork_arm", K, Y[""]["Event"], T>
    Throw: never
  }>,
  T
>
export function fork<K extends keyof any, const A extends ActorLikeArray>(name: K, actorLikeArray: A): Generator<
  Action<"fork", {
    Entry: ActorLikeY<A[number]>[""]["Entry"]
    Event: ChildEvent<
      "fork",
      K,
      {
        [L in keyof A]: ChildEvent<
          "fork_arm",
          L,
          ActorLikeY<A[L]>[""]["Event"],
          ActorLikeT<A[L]>
        >
      }[number],
      ActorLikesT<A>
    >
    Throw: never
  }>,
  ActorLikesT<A>
>
export function fork<K extends keyof any, A extends ActorLikeRecord>(name: K, implementation: A): Generator<
  Action<"fork", {
    Entry: ActorLikeY<A[keyof A]>[""]["Entry"]
    Event: ChildEvent<
      "fork",
      K,
      {
        [L in keyof A]: ChildEvent<
          "fork_arm",
          L,
          ActorLikeY<A[L]>[""]["Event"],
          ActorLikeT<A[L]>
        >
      }[keyof A],
      ActorLikesT<A>
    >
    Throw: never
  }>,
  ActorLikesT<A>
>
export function* fork(key: keyof any, implementation: ActorLike | ActorLikes): Generator<Action<"fork">, any> {
  return yield Action<never>()("fork", async (scope) => {
    const forkScope = scope.fork("fork", key)
    if (typeof implementation === "function" || (!Array.isArray(implementation) && isIteratorLike(implementation))) {
      const actor = unwrapDeferred(implementation as ActorLike)
      const { value } = await forkScope.reduce(actor)
      forkScope.event({
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
      : Reflect.ownKeys(implementation)
    const values = await Promise.all(armKeys.map(async (key) => {
      const forkArmScope = forkScope.fork("fork_arm", key)
      const actor = unwrapDeferred(implementation[key as never]) as Actor
      const { value } = await forkArmScope.reduce(actor)
      forkArmScope.event({
        type: "returned",
        value,
      })
      return value
    }))
    const value = Array.isArray(implementation)
      ? values
      : Object.fromEntries(armKeys.map((key, i) => [key, values[i]]))
    forkScope.event({
      type: "returned",
      value: value,
    })
    return {
      ...scope,
      nextArg: value,
    }
  })
}
