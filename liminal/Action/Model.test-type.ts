import { Model, type ModelEvent } from "./Model.js"
import { Context, type ContextEvent } from "./Context.js"
import type { EnterEvent, ExitEvent } from "./event_common.js"
import { AssertionScope } from "../testing/index.js"

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
      | ContextEvent<
          "Context",
          EnterEvent | ExitEvent<void> | ModelEvent<"A", "language"> | ModelEvent<"B", "embedding">
        >
  }>()
})
