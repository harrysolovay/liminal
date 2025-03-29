import type { Message } from "./Action.js"
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

export interface CurrentContextDetails {
  system: string | undefined
  messages: Array<Message>
  tools: Array<string>
}

export function* CurrentContext(): Generator<CurrentContext, CurrentContextDetails> {
  return yield ActionBase("CurrentContext", {})
}
