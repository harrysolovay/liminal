import { ActionBase, type ActionEventBase } from "./actions_base.ts"

export interface AwaitedEvent<V = unknown> extends ActionEventBase<"await_resolved"> {
  awaited: V
}

export interface Await<T = unknown> extends
  ActionBase<"await", {
    Entry: never
    Event: AwaitedEvent<T>
  }>
{
  toAwait: T
}

function* await_<T>(toAwait: T): Generator<Await<T>, Awaited<T>> {
  return yield ActionBase("await", {
    toAwait,
    async reduce(scope) {
      const result = await toAwait
      scope.events.emit({ type: "await_resolved", awaited: result })
      return scope.spread({ next: result })
    },
  })
}
Object.defineProperty(await_, "name", { value: "await" })
export { await_ as await }
