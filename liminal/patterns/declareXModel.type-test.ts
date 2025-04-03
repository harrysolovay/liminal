import type { ChildEvent, EnteredEvent, ExitedEvent } from "../actions/actions_common.ts"
import { context } from "../actions/Context.ts"
import type { RunEmbed } from "../actions/SetEmbeddingModel.ts"
import type { EmbeddingModelSetEvent } from "../actions/SetEmbeddingModel.ts"
import type { RunInfer } from "../actions/SetLanguageModel.ts"
import type { LanguageModelSetEvent } from "../actions/SetLanguageModel.ts"
import { ActorAssertions } from "../testing/ActorAssertions/ActorAssertions.ts"
import { declareEmbeddingModel } from "./declareEmbeddingModel.ts"
import { declareLanguageModel } from "./declareLanguageModel.ts"

const languageModel = declareLanguageModel("A")
ActorAssertions(languageModel).assertSpec<{
  Entry: ["A", RunInfer]
  Event: LanguageModelSetEvent<"A">
}>()

const embeddingModel = declareEmbeddingModel("B")
ActorAssertions(embeddingModel).assertSpec<{
  Entry: ["B", RunEmbed]
  Event: EmbeddingModelSetEvent<"B">
}>()

function* both() {
  yield* languageModel
  yield* embeddingModel
}

ActorAssertions(both).assertSpec<{
  Entry: ["A", RunInfer] | ["B", RunEmbed]
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
  Entry:
    | ["A", RunInfer]
    | ["B", RunEmbed]
    | ["C", RunInfer]
    | ["D", RunEmbed]
  Event:
    | LanguageModelSetEvent<"C">
    | EmbeddingModelSetEvent<"D">
    | ChildEvent<
      "context",
      "Context",
      EnteredEvent | LanguageModelSetEvent<"A"> | EmbeddingModelSetEvent<"B"> | ExitedEvent<void>
    >
}>()
