import type { ExecSpec } from "./ExecSpec.js"
import type { ProviderReducers } from "./StateReducers/StateReducers.js"

export function Adapter<S extends ExecSpec>(providerReducers: ProviderReducers<S>): Adapter<S> {
  return { providerReducers }
}

export interface Adapter<S extends ExecSpec> {
  providerReducers: ProviderReducers<S>
}
