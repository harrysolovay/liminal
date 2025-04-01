import { type Arg, arg } from "../Arg/Arg.ts"
import { type RunEmbed, type SetEmbeddingModel, setEmbeddingModel } from "../SetEmbeddingModel/SetEmbeddingModel.ts"
import type { EmbeddingModelSetEvent } from "../SetEmbeddingModel/SetEmbeddingModelEvent.ts"

export function* declareEmbeddingModel<K extends keyof any>(key: K): Generator<
  | Arg<{
    Field: { [_ in K]: RunEmbed }
    Event: never
  }>
  | SetEmbeddingModel<{
    Field: never
    Event: EmbeddingModelSetEvent<K>
  }>,
  void
> {
  const runEmbed = yield* arg(key)<RunEmbed>()
  return yield* setEmbeddingModel(key, runEmbed)
}
