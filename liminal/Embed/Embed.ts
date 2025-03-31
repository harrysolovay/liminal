import { ActionBase } from "../Action/ActionBase.ts"
import type { Spec } from "../Spec.ts"
import type { EmbeddedEvent, EmbeddingRequestedEvent } from "./EmbedEvent.ts"

export interface Embed<S extends Spec = Spec> extends ActionBase<"embed", S> {
  value: string
}

export function* Embed(value: string): Generator<
  Embed<{
    LanguageModel: never
    EmbeddingModel: never
    Event: EmbeddedEvent | EmbeddingRequestedEvent
  }>,
  Array<number>
> {
  return yield ActionBase("embed", { value })
}
