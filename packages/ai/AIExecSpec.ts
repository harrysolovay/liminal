import type { CoreMessage, LanguageModelV1, EmbeddingModel } from "ai"

export type AIExecSpec = {
  Message: CoreMessage
  LanguageModel: LanguageModelV1
  EmbeddingModel: EmbeddingModel<string>
}
