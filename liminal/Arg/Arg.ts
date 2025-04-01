import { ActionBase } from "../Action/ActionBase.ts"
import type { Spec } from "../Spec.ts"

export interface Arg<S extends Spec = Spec> extends ActionBase<"arg", S> {
  key: keyof any
}

export function arg<K extends keyof any>(key: K): <T>() => Generator<
  Arg<{
    Field: { [_ in K]: T }
    Event: never
  }>,
  T
> {
  return function*() {
    return yield ActionBase("arg", { key })
  }
}
