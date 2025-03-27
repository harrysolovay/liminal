import { LanguageModel, type LanguageModelEvent } from "./LanguageModel.js"
import { EmbeddingModel, type EmbeddingModelEvent } from "./EmbeddingModel.js"
import { SpecAssertionScope, type Spec } from "../Spec.js"

SpecAssertionScope((assert) => {
  const languageModel = LanguageModel("A")
  assert(languageModel)<Spec<"A", never, LanguageModelEvent<"A">>>()

  const embeddingModel = EmbeddingModel("B")
  assert(embeddingModel)<Spec<never, "B", EmbeddingModelEvent<"B">>>()

  function* both() {
    yield* languageModel
    yield* embeddingModel
  }

  assert(both)<{
    LanguageModel: "A"
    EmbeddingModel: "B"
    Event: LanguageModelEvent<"A"> | EmbeddingModelEvent<"B">
  }>()
})
