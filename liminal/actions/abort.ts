import { Action } from "../Action.ts"
import type { AbortedEvent } from "../events/AbortedEvent.ts"
import type { EnsureNarrow } from "../util/EnsureNarrow.ts"

export function* abort<V>(reason: V, ...[_error]: EnsureNarrow<V>): Generator<
  Action<"abort", {
    Entry: never
    Event: AbortedEvent<V>
    Throw: never
  }>,
  never
> {
  return (yield (Action("abort", (scope) => {
    scope.event({
      type: "aborted",
      reason,
    })
    scope.controller.abort(reason)
    return {
      ...scope,
      nextArg: undefined,
    }
  }))) as never
}
