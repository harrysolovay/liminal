import type { Spec } from "../Spec.js"

export interface ActionBase<K extends string = string, S extends Spec = Spec> {
  "": S
  action: K
}

export function ActionBase<A extends ActionBase>(action: A["action"], fields: Omit<A, keyof ActionBase>): A {
  return {
    action,
    ...fields,
  } as A
}
