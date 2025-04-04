import type { ActionLike } from "../Actor/ActionLike.ts"
import type { ActorLike } from "../Actor/ActorLike.ts"
import { reduce } from "../Actor/reduce.ts"
import { Scope } from "../Scope.ts"
import type { ExtractSpec, Spec } from "../Spec.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"
import { ActionBase } from "./actions_base.ts"
import type { ChildEvent, EnteredEvent, ExitedEvent } from "./actions_common.ts"

export interface Isolate<S extends Spec = Spec> extends ActionBase<"isolate", S> {
  key: keyof any
  actorLike: ActorLike
}

export function* isolate<K extends keyof any, Y extends ActionLike, T, S extends ExtractSpec<Y>>(
  key: K,
  actorLike: ActorLike<Y, T>,
): Generator<
  Isolate<{
    Entry: S["Entry"]
    Event: ChildEvent<"isolate", K, EnteredEvent | S["Event"] | ExitedEvent<T>>
  }>,
  T
> {
  return yield ActionBase("isolate", {
    key,
    actorLike,
    async reduce(scope) {
      const isolateScope = await reduce(
        unwrapDeferred(actorLike),
        new Scope(
          "isolate",
          scope.args,
          undefined,
          scope.events,
          scope.runInfer,
          scope.runEmbed,
        ),
      )
      return scope.spread({
        next: isolateScope.result,
        children: [...scope.children, isolateScope],
      })
    },
  })
}
