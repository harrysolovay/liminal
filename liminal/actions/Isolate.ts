import type { ActionLike } from "../Actor/ActionLike.ts"
import type { ActorLike } from "../Actor/ActorLike.ts"
import { reduce } from "../Actor/reduce.ts"
import { Scope } from "../Scope.ts"
import type { ExtractSpec, Spec } from "../Spec.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"
import { ActionBase } from "./actions_base.ts"

export interface Isolate<S extends Spec = Spec> extends ActionBase<"isolate", S> {
  actorLike: ActorLike
}

export function* isolate<Y extends ActionLike, T>(
  actorLike: ActorLike<Y, T>,
): Generator<Isolate<ExtractSpec<Y>>, T> {
  return yield ActionBase("isolate", {
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
