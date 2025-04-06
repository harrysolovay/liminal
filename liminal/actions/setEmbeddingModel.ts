import { Action } from "../Action.ts"
import type { RunEmbed } from "../adapters.ts"
import type { EmbeddingModelSetEvent } from "../events/EmbeddingModelSetEvent.ts"

export function* setEmbeddingModel<K extends keyof any>(key: K, runEmbed: RunEmbed): Generator<
  Action<"set_embedding_model", {
    Entry: never
    Event: EmbeddingModelSetEvent<K>
    Throw: never
  }>,
  void
> {
  return yield Action("set_embedding_model", (scope) => {
    scope.event({
      type: "embedding_model_set",
      key,
    })
    return {
      ...scope,
      nextArg: undefined,
      runEmbed,
    }
  })
}
