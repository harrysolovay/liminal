import { ActionBase } from "./ActionBase.js"

export interface Messages
  extends ActionBase<
    "Messages",
    {
      LanguageModel: never
      EmbeddingModel: never
      Event: never
    }
  > {}

export function* Messages(): Generator<Messages, Array<string>> {
  return yield ActionBase("Messages", {})
}
