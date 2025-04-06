import type { EventBase } from "./_EventBase.ts"

export interface LanguageModelSetEvent<K extends keyof any = keyof any> extends EventBase<"language_model_set"> {
  key: K
}
