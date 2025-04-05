import type { Scope } from "../Scope.ts"
import type { Spec } from "../Spec.ts"
import type { EventBase } from "./actions_base.ts"
import { ActionBase } from "./actions_base.ts"
import type { Embed } from "./Embed.ts"

export interface SetEmbeddingModel<S extends Spec = Spec> extends ActionBase<"set_embedding_model", S> {
  key: keyof any
  runEmbed: RunEmbed
}

export type RunEmbed = (action: Embed, scope: Scope) => Promise<Array<number>>

export function* setEmbeddingModel<K extends keyof any>(key: K, runEmbed: RunEmbed): Generator<
  SetEmbeddingModel<{
    Entry: never
    Event: EmbeddingModelSetEvent<K>
  }>,
  void
> {
  return yield ActionBase("set_embedding_model", {
    key,
    runEmbed,
    reduce(scope) {
      scope.events.emit({
        type: "embedding_model_set",
        key,
      })
      return scope.spread({
        next: undefined,
        runEmbed,
      })
    },
  })
}

export interface EmbeddingModelSetEvent<K extends keyof any = keyof any> extends EventBase<"embedding_model_set"> {
  key: K
}
