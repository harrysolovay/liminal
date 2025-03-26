import type { Model } from "./Model.js"

export interface ActionPhantoms<M extends Model = Model, E = any> {
  Model: M
  Event: E
}

export function ActionBase<T extends ActionPhantoms>(value: Omit<T, keyof ActionPhantoms>): T {
  return value as T
}

export interface ActionBase<M extends Model = never, E = never> extends ActionPhantoms<M, E> {}
