import { context } from "../Context/Context.ts"
import type { ContextEnteredEvent, ContextExitedEvent, ContextInnerEvent } from "../Context/ContextEvent.ts"
import type { RunEmbed } from "../SetEmbeddingModel/SetEmbeddingModel.ts"
import type { EmbeddingModelSetEvent } from "../SetEmbeddingModel/SetEmbeddingModelEvent.ts"
import type { RunInfer } from "../SetLanguageModel/SetLanguageModel.ts"
import type { LanguageModelSetEvent } from "../SetLanguageModel/SetLanguageModelEvent.ts"
import { ActorAssertions } from "../testing/ActorAssertions.ts"
import { declareEmbeddingModel } from "./declareEmbeddingModel.ts"
import { declareLanguageModel } from "./declareLanguageModel.ts"

const languageModel = declareLanguageModel("A")
ActorAssertions(languageModel).assertSpec<{
  Field: {
    A: RunInfer
  }
  Event: LanguageModelSetEvent<"A">
}>()

const embeddingModel = declareEmbeddingModel("B")
ActorAssertions(embeddingModel).assertSpec<{
  Field: {
    B: RunEmbed
  }
  Event: EmbeddingModelSetEvent<"B">
}>()

function* both() {
  yield* languageModel
  yield* embeddingModel
}

ActorAssertions(both).assertSpec<{
  Field: {
    A: RunInfer
  } | {
    B: RunEmbed
  }
  Event: LanguageModelSetEvent<"A"> | EmbeddingModelSetEvent<"B">
}>()

function* parent() {
  yield* context("Context", function*() {
    yield* both()
  })
  yield* declareLanguageModel("C")
  yield* declareEmbeddingModel("D")
}

ActorAssertions(parent).assertSpec<{
  Field: {
    A: RunInfer
  } | {
    B: RunEmbed
  } | {
    C: RunInfer
  } | {
    D: RunEmbed
  }
  Event:
    | LanguageModelSetEvent<"C">
    | EmbeddingModelSetEvent<"D">
    | ContextEnteredEvent<"Context">
    | ContextInnerEvent<"Context", LanguageModelSetEvent<"A"> | EmbeddingModelSetEvent<"B">>
    | ContextExitedEvent<"Context", void>
}>()
