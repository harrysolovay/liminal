// import type { RunEmbed, RunInfer } from "../../adapters.ts"
// import type { ChildEvent } from "../../events/ChildEvent.ts"
// import type { EmbeddingModelSetEvent } from "../../events/EmbeddingModelSetEvent.ts"
// import type { LanguageModelSetEvent } from "../../events/LanguageModelSetEvent.ts"
// import * as L from "../../L.ts"
// import { ActorAssertions } from "../../testing/ActorAssertions.ts"
// import { declareEmbeddingModel } from "./declareEmbeddingModel.ts"
// import { declareLanguageModel } from "./declareLanguageModel.ts"

// const languageModel = declareLanguageModel("A")
// ActorAssertions(languageModel).assertSpec<{
//   Entry: ["A", RunInfer]
//   Event: LanguageModelSetEvent<"A">
//   Throw: never
//   Child: never
// }>()

// const embeddingModel = declareEmbeddingModel("B")
// ActorAssertions(embeddingModel).assertSpec<{
//   Entry: ["B", RunEmbed]
//   Event: EmbeddingModelSetEvent<"B">
//   Throw: never
//   Child: never
// }>()

// function* both() {
//   yield* languageModel
//   yield* embeddingModel
// }

// ActorAssertions(both).assertSpec<{
//   Entry: ["A", RunInfer] | ["B", RunEmbed]
//   Event: LanguageModelSetEvent<"A"> | EmbeddingModelSetEvent<"B">
//   Throw: never
//   Child: never
// }>()

// function* parent() {
//   yield* L.branch("fork-key", {
//     *key() {
//       yield* both()
//     },
//   })
//   yield* declareLanguageModel("C")
//   yield* declareEmbeddingModel("D")
// }

// ActorAssertions(parent).assertSpec<{
//   Entry:
//     | ["A", RunInfer]
//     | ["B", RunEmbed]
//     | ["C", RunInfer]
//     | ["D", RunEmbed]
//   Event:
//     | ChildEvent<
//       "branch",
//       "fork-key",
//       ChildEvent<
//         "branch_arm",
//         "key",
//         LanguageModelSetEvent<"A"> | EmbeddingModelSetEvent<"B">,
//         void
//       >,
//       { key: void }
//     >
//     | LanguageModelSetEvent<"C">
//     | EmbeddingModelSetEvent<"D">
//   Throw: never
//   Child: never
// }>()
