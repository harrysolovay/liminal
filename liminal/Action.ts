import type { Scope } from "./Scope.ts"
import type { Spec } from "./Spec.ts"
import type { PromiseOr } from "./util/PromiseOr.ts"

export interface Action<K extends string = string, S extends Spec = Spec> {
  "": S
  type: K
  [ActionKey]: true
  reducer(this: this, scope: Scope): PromiseOr<Scope>
}

export type ActionReducer<K extends string, S extends Spec> = (this: Action<K, S>, scope: Scope) => PromiseOr<Scope>

export function Action<K extends string, S extends Spec>(type: K, reducer: ActionReducer<K, S>): Action<K, S> {
  return ({
    type,
    [ActionKey]: true,
    reducer,
  } satisfies Omit<Action<K, S>, "">) as never
}

export type ActionKey = typeof ActionKey
export const ActionKey = Symbol("Liminal/Action")

export function isAction(value: unknown): value is Action {
  return typeof value === "object" && value !== null && ActionKey in value
}
