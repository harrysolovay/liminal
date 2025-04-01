import { ActionBase } from "../Action/ActionBase.ts"
import type { Embed } from "../Embed/Embed.ts"
import type { Scope } from "../Scope/Scope.ts"
import type { Spec } from "../Spec.ts"
import type { EmbeddingModelSetEvent } from "./SetEmbeddingModelEvent.ts"

export interface SetEmbeddingModel<S extends Spec = Spec> extends ActionBase<"set_embedding_model", S> {
  key: keyof any
  runEmbed: RunEmbed
}

export type RunEmbed = (action: Embed, scope: Scope) => Promise<Array<number>>

export function* setEmbeddingModel<K extends keyof any>(key: K, runEmbed: RunEmbed): Generator<
  SetEmbeddingModel<{
    Field: never
    Event: EmbeddingModelSetEvent<K>
  }>,
  void
> {
  return yield ActionBase("set_embedding_model", {
    key,
    runEmbed,
  })
}
