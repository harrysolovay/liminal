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
      value = await value
      scope.events.emit({ type: "await_resolved", value })
      return scope.spread({
        value,
        next: value,
      })
    },
  })
}
Object.defineProperty(await_, "name", { value: "await" })
export { await_ as await }

export interface AwaitResolvedEvent<V = unknown> extends EventBase<"await_resolved"> {
  value: V
}
