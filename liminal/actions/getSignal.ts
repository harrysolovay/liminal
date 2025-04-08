import { Action } from "../Action.ts"

export function* getSignal(): Generator<
  Action<"get_signal", {
    Event: never
    Child: never
    Entry: never
    Throw: never
  }>,
  AbortSignal
> {
  return yield (Action("get_signal", (scope) => ({
    ...scope,
    nextArg: scope.controller.signal,
  })))
}
