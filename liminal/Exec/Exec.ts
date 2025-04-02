import { Scope } from "../Scope/Scope.ts"
import type { Spec } from "../Spec.ts"
import type { ExecEnteredEvent, ExecExitedEvent } from "./ExecEvent.ts"

export interface Exec<S extends Spec, T> {
  exec: (handler?: (event: ExecEnteredEvent | S["Event"] | ExecExitedEvent<T>) => any) => Promise<Scope<T>>
}
