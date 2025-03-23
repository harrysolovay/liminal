import type { LanguageModelV1 } from "ai"
import type { Scope } from "liminal"

export interface AIExecConfig<S extends Scope = Scope> {
  models: Record<"default" | S["ModelKey"], LanguageModelV1>
}
