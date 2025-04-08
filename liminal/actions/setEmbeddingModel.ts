import { Action } from "../Action.ts"
import type { RunEmbed } from "../adapters.ts"
import type { EmbeddingModelSet } from "../events/EmbeddingModelSet.ts"
import type { MakeSpec } from "../Spec.ts"
import type { JSONKey } from "../util/JSONKey.ts"

export interface setEmbeddingModel<K extends JSONKey>
  extends Action<"set_embedding_model", MakeSpec<{ Event: EmbeddingModelSet<K> }>>
{}

export function* setEmbeddingModel<K extends JSONKey>(
  modelKey: K,
  runEmbed: RunEmbed,
): Generator<setEmbeddingModel<K>, void> {
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
