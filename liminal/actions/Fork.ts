import type { Action } from "../Action.ts"
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
import { Scope } from "../Scope.ts"
import type { Spec } from "../Spec.ts"
import { isIteratorLike } from "../util/isIteratorLike.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"
import { ActionBase } from "./actions_base.ts"
import type { ChildEvent } from "./actions_common.ts"

export interface Fork<S extends Spec = Spec> extends ActionBase<"fork", S> {
  key: keyof any
  implementation: ActorLikes | ActorLike
}

export function fork<K extends keyof any, Y extends Action, T>(
  key: K,
  actorLike: ActorLike<Y, T>,
): Generator<
  Fork<{
    Entry: Y[""]["Entry"]
    Event: ChildEvent<"fork_arm", K, Y[""]["Event"], T>
  }>,
  T
>
export function fork<K extends keyof any, const A extends ActorLikeArray>(name: K, actorLikeArray: A): Generator<
  Fork<{
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
  }>,
  ActorLikesT<A>
>
export function fork<K extends keyof any, A extends ActorLikeRecord>(name: K, implementation: A): Generator<
  Fork<{
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
  }>,
  ActorLikesT<A>
>
export function* fork(key: keyof any, implementation: ActorLike | ActorLikes): Generator<Fork, unknown> {
  return yield ActionBase("fork", {
    key,
    implementation,
    async reduce(scope) {
      const events = scope.events.child((event) => ({
        type: "event_propagated",
        scopeType: "fork",
        scope: key,
        event,
      }))
      events.emit({
        type: "entered",
      })
      let scopes: Array<Scope>
      let result: unknown
      if (typeof implementation === "function" || (!Array.isArray(implementation) && isIteratorLike(implementation))) {
        const actor = unwrapDeferred(implementation as ActorLike)
        const forkScope = await new Scope(
          "fork",
          scope.args,
          key,
          events,
          scope.runInfer,
          scope.runEmbed,
          [...scope.messages],
        ).reduce(actor)
        scopes = [forkScope]
        result = forkScope.result
      } else {
        const armKeys = Array.isArray(implementation)
          ? Array.from({ length: implementation.length }, (_0, i) => i)
          : Reflect.ownKeys(implementation)
        scopes = await Promise.all(armKeys.map(async (key) => {
          const armEvents = events.child((event) => ({
            type: "event_propagated",
            scopeType: "fork_arm",
            scope: key,
            event,
          }))
          armEvents.emit({ type: "entered" })
          const actor = unwrapDeferred(implementation[key as never]) as Actor
          const armScope = await new Scope(
            "fork_arm",
            scope.args,
            key,
            events,
            scope.runInfer,
            scope.runEmbed,
            [...scope.messages],
          ).reduce(actor)
          armEvents.emit({
            type: "exited",
            result: armScope.result,
          })
          return armScope
        }))
        result = Array.isArray(implementation)
          ? scopes.map((scope) => scope.result)
          : Object.fromEntries(scopes.map(({ key, result }) => [key, result]))
      }
      events.emit({
        type: "exited",
        result,
      })
      return scope.spread({
        next: result,
        children: [...scope.children, ...scopes],
      })
    },
  })
}
