import { Context } from "../Context/Context.ts"
import type { ContextEnteredEvent, ContextExitedEvent, ContextInnerEvent } from "../Context/ContextEvent.ts"
import { ActorAssertions } from "../testing/ActorAssertions.ts"
import { DeclareModel } from "./DeclareModel.ts"
import type { ModelDeclaredEvent } from "./DeclareModelEvent.ts"

const languageModel = DeclareModel.language("A")
ActorAssertions(languageModel).assertSpec<{
  LanguageModel: "A"
  EmbeddingModel: never
  Event: ModelDeclaredEvent<"A", "language">
}>()

const embeddingModel = DeclareModel.embedding("B")
ActorAssertions(embeddingModel).assertSpec<{
  LanguageModel: never
  EmbeddingModel: "B"
  Event: ModelDeclaredEvent<"B", "embedding">
}>()

function* both() {
  yield* languageModel
  yield* embeddingModel
}

ActorAssertions(both).assertSpec<{
  LanguageModel: "A"
  EmbeddingModel: "B"
  Event: ModelDeclaredEvent<"A", "language"> | ModelDeclaredEvent<"B", "embedding">
}>()

function* parent() {
  yield* Context("Context", function*() {
    yield* both()
  })
  yield* DeclareModel.language("C")
  yield* DeclareModel.embedding("D")
}

ActorAssertions(parent).assertSpec<{
  LanguageModel: "A" | "C"
  EmbeddingModel: "B" | "D"
  Event:
    | ModelDeclaredEvent<"C", "language">
    | ModelDeclaredEvent<"D", "embedding">
    | ContextEnteredEvent<"Context">
    | ContextInnerEvent<"Context", ModelDeclaredEvent<"A", "language"> | ModelDeclaredEvent<"B", "embedding">>
    | ContextExitedEvent<"Context", void>
}>()
