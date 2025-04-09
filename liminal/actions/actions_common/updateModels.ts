import type { EmbeddingModel, LanguageModel, Model } from "../../Model.ts"
import type { Scope } from "../../Scope.ts"
import { unreachable } from "../../util/unreachable.ts"

export function applyToModels<M extends Model>(
  scope: Scope,
  model: M,
  f: (initial: Set<M>) => Set<M>,
): Pick<Scope, "languageModels" | "embeddingModels"> {
  const initial: Set<M> = (model.type === "language" ? scope.languageModels : scope.embeddingModels) as never
  const models = f(new Set(initial))
  return model.type === "language"
    ? {
      languageModels: models as Set<LanguageModel>,
      embeddingModels: scope.embeddingModels,
    }
    : model.type === "embedding"
    ? {
      languageModels: scope.languageModels,
      embeddingModels: models as Set<EmbeddingModel>,
    }
    : unreachable()
}
