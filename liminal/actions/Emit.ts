import { Action } from "../Action.ts"
import type { EmittedEvent } from "../events/EmittedEvent.ts"
import type { JSONValue } from "../util/JSONValue.ts"

export function* emit<K extends keyof any, V extends JSONValue>(key: K, value: V): Generator<
  Action<"emit", {
    Entry: never
    Event: EmittedEvent<K, V>
    Throw: never
  }>,
  undefined
> {
  return yield Action("emit", (scope) => {
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
