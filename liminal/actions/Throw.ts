import { Action } from "../Action.ts"
import type { EnsureNarrow } from "../util/EnsureNarrow.ts"

function* throw_<V>(value: V, ...[_error]: EnsureNarrow<V>): Generator<
  Action<"throw", {
    Entry: never
    Event: never
    Throw: V
  }>,
  () => never
> {
  return yield Action("throw", (scope) => {
    return {
      ...scope,
      thrown: value,
      nextArg: () => {},
    }
  })
}
Object.defineProperty(throw_, "name", { value: "throw" })
export { throw_ as throw }
