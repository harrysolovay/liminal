import type { EventBase } from "../Action.ts"
import { Action } from "../Action.ts"
import type { RunEmbed } from "../adapters.ts"

export function* setEmbeddingModel<K extends keyof any>(key: K, runEmbed: RunEmbed): Generator<
  Action<"set_embedding_model", {
    Entry: never
    Event: EmbeddingModelSetEvent<K>
    Throw: never
  }>,
  void
> {
  return yield Action<never>()("set_embedding_model", (scope) => {
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

export interface EmbeddingModelSetEvent<K extends keyof any = keyof any> extends EventBase<"embedding_model_set"> {
  key: K
}
