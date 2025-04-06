import type { Action } from "../Action.ts"
import { arg } from "../actions/Arg.ts"
import { setEmbeddingModel } from "../actions/SetEmbeddingModel.ts"
import type { RunEmbed } from "../adapters.ts"
import type { EmbeddingModelSetEvent } from "../events/EmbeddingModelSetEvent.ts"

export function* declareEmbeddingModel<K extends keyof any>(key: K): Generator<
  Action<"arg" | "set_embedding_model", {
    Entry: [K, RunEmbed]
    Event: EmbeddingModelSetEvent<K>
    Throw: never
  }>,
  void
> {
  const runEmbed = yield* arg(key)<RunEmbed>()
  return yield* setEmbeddingModel(key, runEmbed)
}
