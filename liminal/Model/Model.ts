import type { Spec } from "../Spec.js"
import { ActionBase } from "../Action/ActionBase.js"
import type { EventBase } from "../Action/ActionEventBase.js"

export interface Model<S extends Spec = Spec> extends ActionBase<"Model", S> {
  key: string
  purpose: ModelPurpose
}

export type ModelPurpose = "language" | "embedding"

export function* Model<K extends string, P extends "language" | "embedding" = "language">(
  key: K,
  purpose: P = "language" as P,
): Generator<
  Model<{
    LanguageModel: P extends "language" ? K : never
    EmbeddingModel: P extends "embedding" ? K : never
    Event: ModelEvent<K, P>
  }>,
  void
> {
  return yield ActionBase("Model", { key, purpose })
}

export interface ModelEvent<K extends string = string, P extends ModelPurpose = ModelPurpose>
  extends EventBase<"Model"> {
  key: K
  purpose: P
}
