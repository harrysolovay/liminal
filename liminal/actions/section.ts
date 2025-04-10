import { Action } from "../Action.ts"
import type { Sectioned } from "../events/Sectioned.ts"
import type { Spec } from "../Spec.ts"
import type { JSONKey } from "../util/JSONKey.ts"

export interface section<K extends JSONKey> extends Action<"section", Spec.Make<{ Event: Sectioned<K> }>> {}

export function* section<K extends JSONKey>(sectionKey: K): Generator<section<K>> {
  return yield Action("section", (scope) => {
    scope.event({
      type: "sectioned",
      sectionKey,
    })
    return {
      ...scope,
      nextArg: undefined,
    }
  })
}
