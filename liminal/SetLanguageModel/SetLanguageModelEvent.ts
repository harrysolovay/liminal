import type { ActionEventBase } from "../Action/ActionEventBase.ts"

export interface LanguageModelSetEvent<K extends keyof any = keyof any> extends ActionEventBase<"language_model_set"> {
  key: K
}
