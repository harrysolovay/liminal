import type { Action } from "../Action.ts"
import { arg } from "../actions/arg.ts"
import { setEmbeddingModel } from "../actions/setEmbeddingModel.ts"
import type { RunEmbed } from "../adapters.ts"
import type { EmbeddingModelSetEvent } from "../events/EmbeddingModelSetEvent.ts"
import type { JSONKey } from "../util/JSONKey.ts"

export function* declareEmbeddingModel<K extends JSONKey>(key: K): Generator<
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
