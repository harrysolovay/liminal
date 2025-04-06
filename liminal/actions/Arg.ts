import type { Spec } from "../Spec.ts"
import { ActionBase } from "./actions_base.ts"

export interface Arg<S extends Spec = Spec> extends ActionBase<"arg", S> {
  key: keyof any
}

export function arg<K extends keyof any>(key: K): <T>() => Generator<
  Arg<{
    Entry: [K, T]
    Event: never
  }>,
  T
> {
  return function*() {
    return yield ActionBase("arg", {
      key,
      reduce(scope) {
        return {
          ...scope,
          nextArg: scope.args[key],
        }
      },
    })
  }
}
