import { setEmbeddingModel } from "../../actions/setEmbeddingModel.ts"
import type { RunEmbed } from "../../adapters.ts"
import type { JSONKey } from "../../util/JSONKey.ts"
import { declareArg } from "../declareArg.ts"

export function* declareEmbeddingModel<K extends JSONKey>(key: K) {
  const runEmbed = yield* declareArg(key)<RunEmbed>()
  return yield* setEmbeddingModel(key, runEmbed)
}
