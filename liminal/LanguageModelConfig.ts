import type { RunInfer } from "./adapters.ts"

export interface LanguageModelConfig<K extends keyof any = keyof any> {
  key: K
  runInfer: RunInfer
}
