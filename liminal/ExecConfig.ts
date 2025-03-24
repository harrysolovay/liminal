import type { Scope } from "./Scope.js"

export interface ExecConfig<Model, S extends Scope> {
  models: {
    default: Model
  } & {
    [_ in S["ModelKey"]]: Model
  }
  handler?: (event: S["Event"]) => unknown
  signal?: AbortSignal // TODO
}
