import type { LanguageModelV1 } from "ai"
import type { EnterEvent, ExitEvent, Scope } from "liminal"

export type ExecConfig<S extends Scope = Scope> = {
  models: Record<"default" | S["ModelKey"], LanguageModelV1>
  handler?: (event: EnterEvent | S["Event"] | ExitEvent<S["Result"]>) => unknown
  signal?: AbortSignal
}
