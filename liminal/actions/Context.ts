import type { ActionLike } from "../Actor/ActionLike.ts"
import type { ActorLike } from "../Actor/ActorLike.ts"
import { reduce } from "../Actor/reduce.ts"
import { Scope } from "../Scope.ts"
import type { ExtractSpec, Spec } from "../Spec.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"
import { ActionBase } from "./actions_base.ts"
import type { ChildEvent, EnteredEvent, ExitedEvent } from "./actions_common.ts"

export interface Context<S extends Spec = Spec> extends ActionBase<"context", S> {
  key: keyof any
  implementation: ActorLike
}

export function* context<K extends keyof any, Y extends ActionLike, S extends ExtractSpec<Y>, T = string>(
  key: K,
  implementation: ActorLike<Y, T>,
): Generator<
  Context<{
    Entry: S["Entry"]
    Event: ChildEvent<"context", K, EnteredEvent | S["Event"] | ExitedEvent<T>>
  }>,
  T
> {
  return yield ActionBase("context", {
    key,
    implementation,
    async reduce(scope) {
      const actor = unwrapDeferred(implementation)
      const events = scope.events.child((event) => ({
        type: "child",
        scopeType: "context",
        scope: key,
        event,
      }))
      events.emit({
        type: "entered",
      })
      const contextScope = await reduce(
        actor,
        new Scope(
          scope.args,
          key,
          events,
          scope.runInfer,
          scope.runEmbed,
        ),
      )
      events.emit({
        type: "exited",
        result: contextScope.result,
      })
      return scope.spread({
        next: contextScope.result,
        children: [...scope.children, {
          type: "context",
          scope: contextScope,
        }],
      })
    },
  })
}
