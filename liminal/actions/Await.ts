import { ActionBase, type EventBase } from "./actions_base.ts"

export interface AwaitedEvent<V = unknown> extends EventBase<"await_resolved"> {
  value: V
}

export interface Await<T = unknown> extends
  ActionBase<"await", {
    Entry: never
    Event: AwaitedEvent<T>
  }>
{
  value: T
}

function* await_<T>(value: T): Generator<Await<T>, Awaited<T>> {
  return yield ActionBase("await", {
    value,
    async reduce(scope) {
      const result = await value
      scope.events.emit({ type: "await_resolved", value: result })
      return scope.spread({
        result,
        next: result,
      })
    },
  })
}
Object.defineProperty(await_, "name", { value: "await" })
export { await_ as await }
