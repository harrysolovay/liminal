import { Action } from "../Action.ts"

export interface getSignal extends Action<"get_signal", never> {}

export function* getSignal(): Generator<getSignal, AbortSignal> {
  return yield (Action("get_signal", (scope) => ({
    ...scope,
    nextArg: scope.controller.signal,
  })))
}
