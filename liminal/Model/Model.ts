import { ActionBase } from "../Action/ActionBase.js"
import type { Spec } from "../Spec.js"
import type { ModelEvent } from "./ModelEvent.js"
import type { ModelPurpose } from "./ModelPurpose.js"

export class Model<S extends Spec = Spec> implements ActionBase<"Model", S> {
  static *language<K extends keyof any>(key: K): Generator<
    Model<{
      LanguageModel: K
      EmbeddingModel: never
      Event: ModelEvent<K, "language">
    }>,
    void
  > {
    return yield ActionBase("Model", {
      key,
      purpose: "language",
    })
  }

  static *embedding<K extends keyof any>(key: K): Generator<
    Model<{
      LanguageModel: never
      EmbeddingModel: K
      Event: ModelEvent<K, "embedding">
    }>,
    void
  > {
    return yield ActionBase("Model", {
      key,
      purpose: "embedding",
    })
  }

  declare "": S
  declare action: "Model"
  declare key: keyof any
  declare purpose: ModelPurpose
}
