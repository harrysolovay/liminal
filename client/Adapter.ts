import type { Type } from "../core/mod.ts"

export interface Provider {
  M: string
  I: unknown
  O: unknown
  E: unknown
}

export interface Adapter<P extends Provider> {
  formatInput: (raw: string) => P["I"]
  unwrapOutput: (message: P["O"]) => string
  complete: <T>(config: AdapterCompleteConfig<T, P>) => Promise<P["O"]>
  transform?: <T>(type: Type<T, never>) => Type<T>
}

export interface AdapterCompleteConfig<T, P extends Provider> {
  type: Type<T, never>
  messages?: Array<P["I" | "O"]>
  model?: P["M"]
  options?: P["E"]
}
