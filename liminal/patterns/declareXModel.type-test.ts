import type { ChildEvent } from "../actions/actions_common.ts"
import type { EmbeddingModelSetEvent } from "../actions/SetEmbeddingModel.ts"
import type { LanguageModelSetEvent } from "../actions/SetLanguageModel.ts"
import type { RunEmbed, RunInfer } from "../adapters.ts"
import * as L from "../L.ts"
import { ActorAssertions } from "../testing/ActorAssertions.ts"
import { declareEmbeddingModel } from "./declareEmbeddingModel.ts"
import { declareLanguageModel } from "./declareLanguageModel.ts"

const languageModel = declareLanguageModel("A")
ActorAssertions(languageModel).assertSpec<{
  Entry: ["A", RunInfer]
  Event: LanguageModelSetEvent<"A">
  Throw: never
}>()

const embeddingModel = declareEmbeddingModel("B")
ActorAssertions(embeddingModel).assertSpec<{
  Entry: ["B", RunEmbed]
  Event: EmbeddingModelSetEvent<"B">
  Throw: never
}>()

function* both() {
  yield* languageModel
  yield* embeddingModel
}

ActorAssertions(both).assertSpec<{
  Entry: ["A", RunInfer] | ["B", RunEmbed]
  Event: LanguageModelSetEvent<"A"> | EmbeddingModelSetEvent<"B">
  Throw: never
}>()

function* parent() {
  yield* L.fork("fork-key", {
    *key() {
      yield* both()
    },
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
    | ChildEvent<
      "fork",
      "fork-key",
      ChildEvent<
        "fork_arm",
        "key",
        LanguageModelSetEvent<"A"> | EmbeddingModelSetEvent<"B">,
        void
      >,
      { key: void }
    >
    | LanguageModelSetEvent<"C">
    | EmbeddingModelSetEvent<"D">
  Throw: never
}>()
