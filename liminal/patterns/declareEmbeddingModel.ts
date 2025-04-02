import { type Arg, arg } from "../actions/Arg.ts"
import { type RunEmbed, type SetEmbeddingModel, setEmbeddingModel } from "../actions/SetEmbeddingModel.ts"
import type { EmbeddingModelSetEvent } from "../actions/SetEmbeddingModel.ts"

export function* declareEmbeddingModel<K extends keyof any>(key: K): Generator<
  | Arg<{
    Entry: [K, RunEmbed]
    Event: never
  }>
  | SetEmbeddingModel<{
    Entry: never
    Event: EmbeddingModelSetEvent<K>
  }>,
  void
> {
  const runEmbed = yield* arg(key)<RunEmbed>()
  return yield* setEmbeddingModel(key, runEmbed)
}
