import type { Scope } from "./Scope.js"

export interface Exec<S extends Scope = Scope> {
  run: (handler?: (event: S["Event"]) => unknown) => Promise<S["Result"]>
}
