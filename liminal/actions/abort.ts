import { Action } from "../Action.ts"
import type { Aborted } from "../events/Aborted.ts"
import type { EnsureNarrow } from "../util/EnsureNarrow.ts"

export function* abort<V>(reason: V, ...[_error]: EnsureNarrow<V>): Generator<
  Action<"abort", {
    Event: Aborted<V>
    Child: never
    Entry: never
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
