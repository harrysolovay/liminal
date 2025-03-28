import { ActionBase } from "./ActionBase.js"

export interface CurrentContext
  extends ActionBase<
    "CurrentContext",
    {
      LanguageModel: never
      EmbeddingModel: never
      Event: never
    }
  > {}

export function* CurrentContext(): Generator<CurrentContext, Array<string>> {
  return yield ActionBase("CurrentContext", {})
}
