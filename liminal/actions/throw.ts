import { Action } from "../Action.ts"
import type { MakeSpec } from "../Spec.ts"
import type { EnsureNarrow } from "../util/EnsureNarrow.ts"

function* throw_<V>(value: V, ...[_error]: EnsureNarrow<V>): Generator<
  Action<
    "throw",
    MakeSpec<{
      Throw: V
    }>
  >,
  never
> {
  return (yield Action("throw", (scope) => {
    return {
      ...scope,
      thrown: value,
      nextArg: undefined,
    }
  })) as never
}
Object.defineProperty(throw_, "name", { value: "throw" })
export { throw_ as throw }
