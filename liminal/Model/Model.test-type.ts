import { Context } from "../Context/Context.js"
import type { ContextEnterEvent, ContextExitEvent, ContextInnerEvent } from "../Context/ContextEvent.js"
import { ActorAssertions } from "../testing/ActorAssertions.js"
import { Model } from "./Model.js"
import type { ModelEvent } from "./ModelEvent.js"

const languageModel = Model.language("A")
ActorAssertions(languageModel).assertSpec<{
  LanguageModel: "A"
  EmbeddingModel: never
  Event: ModelEvent<"A", "language">
}>()

const embeddingModel = Model.embedding("B")
ActorAssertions(embeddingModel).assertSpec<{
  LanguageModel: never
  EmbeddingModel: "B"
  Event: ModelEvent<"B", "embedding">
}>()

function* both() {
  yield* languageModel
  yield* embeddingModel
}

ActorAssertions(both).assertSpec<{
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

ActorAssertions(parent).assertSpec<{
  LanguageModel: "A" | "C"
  EmbeddingModel: "B" | "D"
  Event:
    | ModelEvent<"C", "language">
    | ModelEvent<"D", "embedding">
    | ContextEnterEvent<"Context">
    | ContextInnerEvent<"Context", ModelEvent<"A", "language"> | ModelEvent<"B", "embedding">>
    | ContextExitEvent<"Context", void>
}>()
