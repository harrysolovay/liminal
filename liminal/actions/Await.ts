import { Action, type EventBase } from "../Action.ts"

function* await_<T>(value: T): Generator<
  Action<"await", {
    Entry: never
    Event: AwaitResolvedEvent<T>
    Throw: never
  }>,
  Awaited<T>
> {
  return yield Action<never>()("await", async (scope) => {
    value = await value
    scope.event({
      type: "await_resolved",
      value,
    })
    return {
      ...scope,
      nextArg: value,
    }
  })
}
Object.defineProperty(await_, "name", { value: "await" })
export { await_ as await }

export interface AwaitResolvedEvent<V = unknown> extends EventBase<"await_resolved"> {
  value: V
}
