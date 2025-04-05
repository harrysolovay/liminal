import type { Action } from "../Action.ts"
import type { Scope } from "../Scope.ts"
import type { Spec } from "../Spec.ts"
import type { PromiseOr } from "../util/PromiseOr.ts"

export interface ActionBase<K extends string = string, S extends Spec = Spec> {
  "": S
  [ActionKey]: true
  action: K
  reduce(this: this, scope: Scope): PromiseOr<Scope>
}

export function ActionBase<A extends ActionBase>(
  action: A["action"],
  fields: Omit<A, "" | "action" | ActionKey>,
): A {
  return {
    [ActionKey]: true,
    action,
    ...fields,
  } as A
}

export interface ActionEventBase<K extends string> {
  type: K
}

export type ActionKey = typeof ActionKey
export const ActionKey = Symbol("Liminal/Action")

export function isAction(value: unknown): value is Action {
  return typeof value === "object" && value !== null && ActionKey in value
}
