import { Action } from "../Action.ts"
import type { Spec } from "../Spec.ts"
import type { EnsureNarrow } from "../util/EnsureNarrow.ts"

export { throw_ as throw }

interface throw_<V> extends Action<"throw", Spec.Make<{ Throw: V }>> {}

function* throw_<V>(value: V, ...[_error]: EnsureNarrow<V>): Generator<throw_<V>, never> {
  return (yield Action("throw", (scope) => {
    return {
      ...scope,
      thrown: value,
      nextArg: undefined,
    }
  })) as never
}
Object.defineProperty(throw_, "name", { value: "throw" })
