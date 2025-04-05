import type { Action } from "../Action.ts"
import type { ActorLike } from "../Actor.ts"
import { Scope } from "../Scope.ts"
import type { Spec } from "../Spec.ts"
import type { Result } from "../util/Result.ts"
import { unwrapDeferred } from "../util/unwrapDeferred.ts"
import { ActionBase, type EventBase } from "./actions_base.ts"
import type { ChildEvent } from "./actions_common.ts"

export interface Try<S extends Spec = Spec> extends ActionBase<"try", S> {}

function* try_<K extends keyof any, Y extends Action, T, E>(
  key: K,
  actorLike: ActorLike<Y, T>,
  catch_: (thrown: unknown) => E,
): Generator<
  Try<{
    Entry: Y[""]["Entry"]
    Event: ChildEvent<"try", K, ErroredEvent<E>, T>
  }>,
  Result<T, E>
> {
  return yield ActionBase("try", {
    async reduce(scope) {
      const events = scope.events.child((event) => ({
        type: "event_propagated",
        scopeType: "try",
        scope: key,
        event,
      }))
      events.emit({
        type: "entered",
      })
      const actor = unwrapDeferred(actorLike)
      const tryScope = new Scope(
        "try",
        scope.args,
        key,
        events,
        scope.runInfer,
        scope.runEmbed,
        [...scope.messages],
      )
      try {
        await tryScope.reduce(actor)
        events.emit({
          type: "exited",
          value: tryScope.children,
        })
      } catch (e: unknown) {
        const error = catch_(e)
        events.emit({
          type: "errored",
          error,
        })
      }
      return scope.spread({
        children: [...scope.children, tryScope],
      })
    },
  })
}
Object.defineProperty(try_, "name", { value: "try" })
export { try_ as try }

export interface ErroredEvent<E = any> extends EventBase<"errored"> {
  error: E
}
