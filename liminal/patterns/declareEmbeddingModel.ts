import { arg } from "../Arg/Arg.ts"
import { type RunEmbed, setEmbeddingModel } from "../SetEmbeddingModel/SetEmbeddingModel.ts"

export function* declareEmbeddingModel<K extends keyof any>(key: K) {
  const runEmbed = yield* arg(key)<RunEmbed>()
  return yield* setEmbeddingModel(key, runEmbed)
}
