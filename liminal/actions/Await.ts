import type { Spec } from "../Spec.ts"
import { ActionBase, type EventBase } from "./actions_base.ts"

export interface Await<S extends Spec = Spec> extends ActionBase<"await", S> {
  value: any
}

function* await_<T>(value: T): Generator<
  Await<{
    Entry: never
    Event: AwaitResolvedEvent<T>
  }>,
  Awaited<T>
> {
  return yield ActionBase("await", {
    value,
    async reduce(scope) {
      const result = await value
      scope.events.emit({ type: "await_resolved", value: result })
      return scope.spread({
        value: result,
        next: result,
      })
    },
  })
}
Object.defineProperty(await_, "name", { value: "await" })
export { await_ as await }

export interface AwaitResolvedEvent<V = unknown> extends EventBase<"await_resolved"> {
  value: V
}
