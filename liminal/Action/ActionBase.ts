import type { Model } from "./Model.js"

export interface ActionBase<K extends string = string, M extends Model = never, E = never>
  extends ActionPhantoms<M, E> {
  action: K
}

export interface ActionPhantoms<M extends Model = Model, E = any> {
  Model: M
  Event: E
}

export function ActionBase<A extends ActionBase>(action: A["action"], fields: Omit<A, keyof ActionBase>): A {
  return {
    action,
    ...fields,
  } as A
}
