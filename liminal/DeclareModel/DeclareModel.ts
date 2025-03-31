import { ActionBase } from "../Action/ActionBase.ts"
import type { Spec } from "../Spec.ts"
import type { ModelDeclaredEvent } from "./DeclareModelEvent.ts"
import type { ModelPurpose } from "./ModelPurpose.ts"

export class DeclareModel<S extends Spec = Spec> implements ActionBase<"declare_model", S> {
  static *language<K extends keyof any>(key: K): Generator<
    DeclareModel<{
      LanguageModel: K
      EmbeddingModel: never
      Event: ModelDeclaredEvent<K, "language">
    }>,
    void
  > {
    return yield ActionBase("declare_model", {
      key,
      purpose: "language",
    })
  }

  static *embedding<K extends keyof any>(key: K): Generator<
    DeclareModel<{
      LanguageModel: never
      EmbeddingModel: K
      Event: ModelDeclaredEvent<K, "embedding">
    }>,
    void
  > {
    return yield ActionBase("declare_model", {
      key,
      purpose: "embedding",
    })
  }

  declare "": S
  declare action: "declare_model"
  declare key: keyof any
  declare purpose: ModelPurpose
}
