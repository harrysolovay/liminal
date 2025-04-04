import type { ActorLike } from "../Actor/ActorLike.ts"
import { reduce } from "../Actor/reduce.ts"
import { Scope } from "../Scope.ts"
import type { ExtractSpec, Spec } from "../Spec.ts"
import type { Expand } from "../util/Expand.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"
import { ActionBase } from "./actions_base.ts"
import type { ChildEvent, EnteredEvent, ExitedEvent } from "./actions_common.ts"

export interface Fork<S extends Spec = Spec> extends ActionBase<"fork", S> {
  groupKey: keyof any
  arms: ActorLikes
}

export type ActorLikes = ActorLikeArray | ActorLikeRecord
export type ActorLikeArray = Array<ActorLike>
export type ActorLikeRecord = Record<string, ActorLike>
export type ActorLikesY<A extends ActorLikes> = {
  [K in keyof A]: A[K] extends ActorLike<infer Y> ? Y : never
}[keyof A]

export function* fork<
  G extends keyof any,
  const A extends ActorLikes,
  AS extends ExtractSpec<ActorLikesY<A>>,
>(
  groupKey: G,
  arms: A,
): Generator<
  Fork<{
    Entry: AS["Entry"]
    Event: ChildEvent<"fork", G, EnteredEvent | AS["Event"] | ExitedEvent<ForkResult<A>>>
  }>,
  ForkResult<A>
> {
  return yield ActionBase("fork", {
    groupKey,
    arms,
    async reduce(scope) {
      const events = scope.events.child((event) => ({
        type: "child",
        scopeType: "fork",
        scope: groupKey,
        event,
      }))
      events.emit({
        type: "entered",
      })
      const armKeys = Array.isArray(arms) ? Array.from({ length: arms.length }, (_0, i) => i) : Reflect.ownKeys(arms)
      const armScopes = await Promise.all(armKeys.map(async (key) => {
        const armEvents = events.child((event) => ({
          type: "child",
          scopeType: "fork_arm",
          scope: key,
          event,
        }))
        armEvents.emit({ type: "entered" })
        const actor = unwrapDeferred(arms[key as never])
        const armScope = await reduce(
          actor,
          new Scope(
            scope.args,
            groupKey,
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
        return [key, armScope] as const
      }))
      const result = Array.isArray(arms)
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
          scopes: Object.fromEntries(armScopes),
        }],
      })
    },
  })
}

export type ForkResult<A extends ActorLikes> = Expand<
  {
    -readonly [K in keyof A]: A[K] extends ActorLike<any, infer T> ? T : never
  }
>
