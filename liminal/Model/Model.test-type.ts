import { Model } from "./Model.js"
import { Context } from "../Context/Context.js"
import type { ContextEnterEvent, ContextExitEvent, ContextInnerEvent } from "../Context/ContextEvent.js"
import { AssertionScope } from "../testing/AssertionScope.js"
import type { ModelEvent } from "./ModelEvent.js"

AssertionScope((assert) => {
  const languageModel = Model("A")
  assert.spec(languageModel).equals<{
    LanguageModel: "A"
    EmbeddingModel: never
    Event: ModelEvent<"A", "language">
  }>()

  const embeddingModel = Model("B", "embedding")
  assert.spec(embeddingModel).equals<{
    LanguageModel: never
    EmbeddingModel: "B"
    Event: ModelEvent<"B", "embedding">
  }>()

  function* both() {
    yield* languageModel
    yield* embeddingModel
  }

  assert.spec(both).equals<{
    LanguageModel: "A"
    EmbeddingModel: "B"
    Event: ModelEvent<"A", "language"> | ModelEvent<"B", "embedding">
  }>()

  function* parent() {
    yield* Context("Context", function* () {
      yield* both()
    })
    yield* Model("C")
    yield* Model("D", "embedding")
  }

  assert.spec(parent).equals<{
    LanguageModel: "A" | "C"
    EmbeddingModel: "B" | "D"
    Event:
      | ModelEvent<"C", "language">
      | ModelEvent<"D", "embedding">
      | ContextEnterEvent<"Context">
      | ContextInnerEvent<"Context", ModelEvent<"A", "language"> | ModelEvent<"B", "embedding">>
      | ContextExitEvent<"Context", void>
  }>()
})
