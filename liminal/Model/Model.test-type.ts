import { Context } from "../Context/Context.js"
import type { ContextEnterEvent, ContextExitEvent, ContextInnerEvent } from "../Context/ContextEvent.js"
import { ActorLikeAssertions } from "../testing/ActorLikeAssertions.js"
import { Model } from "./Model.js"
import type { ModelEvent } from "./ModelEvent.js"

const languageModel = Model.language("A")
ActorLikeAssertions(languageModel).assertSpec<{
  LanguageModel: "A"
  EmbeddingModel: never
  Event: ModelEvent<"A", "language">
}>()

const embeddingModel = Model.embedding("B")
ActorLikeAssertions(embeddingModel).assertSpec<{
  LanguageModel: never
  EmbeddingModel: "B"
  Event: ModelEvent<"B", "embedding">
}>()

function* both() {
  yield* languageModel
  yield* embeddingModel
}

ActorLikeAssertions(both).assertSpec<{
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

ActorLikeAssertions(parent).assertSpec<{
  LanguageModel: "A" | "C"
  EmbeddingModel: "B" | "D"
  Event:
    | ModelEvent<"C", "language">
    | ModelEvent<"D", "embedding">
    | ContextEnterEvent<"Context">
    | ContextInnerEvent<"Context", ModelEvent<"A", "language"> | ModelEvent<"B", "embedding">>
    | ContextExitEvent<"Context", void>
}>()
