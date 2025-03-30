import { Context } from "../Context/Context.js"
import type { ContextEnterEvent, ContextExitEvent, ContextInnerEvent } from "../Context/ContextEvent.js"
import { AssertionScope } from "../testing/AssertionScope.js"
import { Model } from "./Model.js"
import type { ModelEvent } from "./ModelEvent.js"

AssertionScope((assert) => {
  const languageModel = Model.language("A")
  assert.spec(languageModel).equals<{
    LanguageModel: "A"
    EmbeddingModel: never
    Event: ModelEvent<"A", "language">
  }>()

  const embeddingModel = Model.embedding("B")
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
    yield* Context("Context", function*() {
      yield* both()
    })
    yield* Model.language("C")
    yield* Model.embedding("D")
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
