import { LanguageModel, type LanguageModelEvent } from "./LanguageModel.js"
import { EmbeddingModel, type EmbeddingModelEvent } from "./EmbeddingModel.js"
import { AssertionScope, type Spec } from "../Spec.js"
import { Context, type ContextEvent } from "./Context.js"
import type { EnterEvent, ExitEvent } from "./event_common.js"

AssertionScope((assert) => {
  const languageModel = LanguageModel("A")
  assert.spec(languageModel).equals<Spec<"A", never, LanguageModelEvent<"A">>>()

  const embeddingModel = EmbeddingModel("B")
  assert.spec(embeddingModel).equals<Spec<never, "B", EmbeddingModelEvent<"B">>>()

  function* both() {
    yield* languageModel
    yield* embeddingModel
  }

  assert.spec(both).equals<{
    LanguageModel: "A"
    EmbeddingModel: "B"
    Event: LanguageModelEvent<"A"> | EmbeddingModelEvent<"B">
  }>()

  function* parent() {
    yield* Context("Context", function* () {
      yield* both()
    })
    yield* LanguageModel("C")
    yield* EmbeddingModel("D")
  }

  assert.spec(parent).equals<{
    LanguageModel: "A" | "C"
    EmbeddingModel: "B" | "D"
    Event:
      | LanguageModelEvent<"C">
      | EmbeddingModelEvent<"D">
      | ContextEvent<"Context", EnterEvent | ExitEvent<void> | LanguageModelEvent<"A"> | EmbeddingModelEvent<"B">>
  }>()
})
