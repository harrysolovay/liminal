import type { Scope } from "../Scope.ts"
import type { Spec } from "../Spec.ts"
import type { PromiseOr } from "../util/PromiseOr.ts"

export interface ActionBase<K extends string = string, S extends Spec = Spec> {
  "": S
  action: K
  reduce(scope: Scope): PromiseOr<Scope>
}

export function ActionBase<A extends ActionBase>(action: A["action"], fields: Omit<A, "" | "action">): A {
  return { action, ...fields } as A
}

export interface ActionEventBase<K extends string> {
  type: K
}

export interface EnteredEvent extends ActionEventBase<"entered"> {}

export interface ExitedEvent<T = any> extends ActionEventBase<"exited"> {
  result: T
}
