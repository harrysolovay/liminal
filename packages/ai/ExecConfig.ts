import type { LanguageModelV1 } from "ai"
import type { Scope } from "liminal"

export type ExecConfig<S extends Scope = Scope> = {
  models: Record<"default" | S["ModelKey"], LanguageModelV1>
  handler?: (event: S["Event"]) => unknown
  signal?: AbortSignal
}
