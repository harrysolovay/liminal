import { Action } from "../Action.ts"
import type { Aborted } from "../events/Aborted.ts"
import type { MakeSpec } from "../Spec.ts"
import type { EnsureNarrow } from "../util/EnsureNarrow.ts"

export interface abort<V> extends Action<"abort", MakeSpec<{ Event: Aborted<V> }>> {}

export function* abort<V>(reason: V, ...[_error]: EnsureNarrow<V>): Generator<
  abort<V>,
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
