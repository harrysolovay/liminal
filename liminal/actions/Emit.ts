import { Action, type EventBase } from "../Action.ts"
import type { JSONValue } from "../util/JSONValue.ts"

export function* emit<K extends keyof any, V extends JSONValue>(key: K, value: V): Generator<
  Action<"emit", {
    Entry: never
    Event: EmittedEvent<K, V>
    Throw: never
  }>,
  undefined
> {
  return yield Action<never>()("emit", (scope) => {
    scope.event({
      type: "emitted",
      key,
      value,
    })
    return {
      ...scope,
      nextArg: undefined,
    }
  })
}

export interface EmittedEvent<K extends keyof any = keyof any, E extends JSONValue = JSONValue>
  extends EventBase<"emitted">
{
  key: K
  value: E
}
