import { ActionBase } from "../Action/ActionBase.js"
import type { Spec } from "../Spec.js"
import type { ModelEvent } from "./ModelEvent.js"
import type { ModelPurpose } from "./ModelPurpose.js"

export interface Model<S extends Spec = Spec> extends ActionBase<"Model", S> {
  key: keyof any
  purpose: ModelPurpose
}

export function* Model<K extends keyof any = "default", P extends "language" | "embedding" = "language">(
  key: K = "default" as K,
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
