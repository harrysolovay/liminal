import { ActionBase } from "../Action/ActionBase.js"
import type { Spec } from "../Spec.js"
import type { EmbeddedEvent } from "./EmbedEvent.js"

export interface Embed<S extends Spec = Spec> extends ActionBase<"embed", S> {
  value: string
}

export function* Embed(value: string): Generator<
  Embed<{
    LanguageModel: never
    EmbeddingModel: never
    Event: EmbeddedEvent
  }>,
  Array<number>
> {
  return yield ActionBase("embed", { value })
}
