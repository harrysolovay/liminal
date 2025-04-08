import { Action } from "../Action.ts"
import type { RunEmbed } from "../adapters.ts"
import type { EmbeddingModelSet } from "../events/EmbeddingModelSet.ts"
import type { JSONKey } from "../util/JSONKey.ts"

export function* setEmbeddingModel<K extends JSONKey>(modelKey: K, runEmbed: RunEmbed): Generator<
  Action<"set_embedding_model", {
    Event: EmbeddingModelSet<K>
    Child: never
    Entry: never
    Throw: never
  }>,
  void
> {
  return yield Action("set_embedding_model", (scope) => {
    scope.event({
      type: "embedding_model_set",
      modelKey,
    })
    return {
      ...scope,
      nextArg: undefined,
      runEmbed,
    }
  })
}
