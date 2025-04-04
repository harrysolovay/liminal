import type { ActionLike } from "../Actor/ActionLike.ts"
import type { ActorLike } from "../Actor/ActorLike.ts"
import { reduce } from "../Actor/reduce.ts"
import { Scope } from "../Scope.ts"
import type { ExtractSpec, Spec } from "../Spec.ts"
import type { Expand } from "../util/Expand.ts"
import { isIteratorLike } from "../util/isIteratorLike.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"
import { ActionBase } from "./actions_base.ts"
import type { ChildEvent, EnteredEvent, ExitedEvent } from "./actions_common.ts"

export interface Fork<S extends Spec = Spec> extends ActionBase<"fork", S> {
  key: keyof any
  implementation: ActorLikes | ActorLike
}

export type ActorLikes = ActorLikeArray | ActorLikeRecord
export type ActorLikeArray = Array<ActorLike>
export type ActorLikeRecord = Record<string, ActorLike>
export type ActorLikesY<A extends ActorLikes> = {
  [L in keyof A]: A[L] extends ActorLike<infer Y> ? Y : never
}[keyof A]

export function fork<
  K extends keyof any,
  Y extends ActionLike,
  T,
  S extends ExtractSpec<Y>,
>(
  key: K,
  implementation: ActorLike<Y, T>,
): Generator<
  Fork<{
    Entry: S["Entry"]
    Event: ChildEvent<"fork_arm", K, EnteredEvent | S["Event"] | ExitedEvent<T>>
  }>,
  T
>
export function fork<K extends keyof any, const A extends ActorLikes>(
  name: K,
  implementation: A,
): Generator<
  Fork<{
    Entry: ExtractSpec<ActorLikesY<A>>["Entry"]
    Event: ChildEvent<
      "fork",
      K,
      | EnteredEvent
      | {
        [L in keyof A]: A[L] extends ActorLike<infer Y, infer T>
          ? ChildEvent<"fork_arm", L, EnteredEvent | ExtractSpec<Y>["Event"] | ExitedEvent<T>>
          : never
      }[keyof A]
      | ExitedEvent<ForkArmResults<A>>
    >
  }>,
  ForkArmResults<A>
>
export function* fork(
  key: keyof any,
  implementation: ActorLike | ActorLikes,
): Generator<Fork, unknown> {
  return yield ActionBase("fork", {
    key,
    implementation,
    async reduce(scope) {
      const events = scope.events.child((event) => ({
        type: "child",
        scopeType: "fork",
        scope: key,
        event,
      }))
      events.emit({
        type: "entered",
      })
      let scopes: Array<Scope>
      let result: unknown
      if (typeof implementation === "function" || isIteratorLike(implementation)) {
        const actor = unwrapDeferred(implementation as ActorLike)
        const forkScope = await reduce(
          actor,
          new Scope(
            "fork",
            scope.args,
            key,
            events,
            scope.runInfer,
            scope.runEmbed,
            [...scope.messages],
          ),
        )
        scopes = [forkScope]
        result = forkScope.result
      } else {
        const armKeys = Array.isArray(implementation)
          ? Array.from({ length: implementation.length }, (_0, i) => i)
          : Reflect.ownKeys(implementation)
        scopes = await Promise.all(armKeys.map(async (key) => {
          const armEvents = events.child((event) => ({
            type: "child",
            scopeType: "fork_arm",
            scope: key,
            event,
          }))
          armEvents.emit({ type: "entered" })
          const actor = unwrapDeferred(implementation[key as never])
          const armScope = await reduce(
            actor,
            new Scope(
              "fork_arm",
              scope.args,
              key,
              events,
              scope.runInfer,
              scope.runEmbed,
              [...scope.messages],
            ),
          )
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

export type ForkArmResults<A extends ActorLikes> = Expand<
  {
    -readonly [K in keyof A]: A[K] extends ActorLike<any, infer T> ? T : never
  }
>
