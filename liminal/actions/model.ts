import { Action } from "../Action.ts"
import type { ModelPushed } from "../events/ModelPushed.ts"
import type { ModelRemoved } from "../events/ModelRemoved.ts"
import type { Model, ModelType } from "../Model.ts"
import type { Spec } from "../Spec.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import { applyToModels } from "./actions_common/updateModels.ts"

export interface pushModel<K extends JSONKey, M extends ModelType>
  extends Action<"remove_model", Spec.Make<{ Event: ModelPushed<K, M> }>>
{}

export interface removeModel<K extends JSONKey, M extends ModelType>
  extends Action<"remove_model", Spec.Make<{ Event: ModelRemoved<K, M> }>>
{}

export function* model<K extends JSONKey, M extends Model>(
  modelKey: K,
  model: M,
): Generator<pushModel<K, M["type"]>, Generator<removeModel<K, M["type"]>, void>> {
  return yield Action("remove_model", (scope) => {
    scope.event({
      type: "model_pushed",
      modelKey,
      modelType: model.type,
    })
    return {
      ...scope,
      ...applyToModels(scope, model, (models) => {
        models.add(model)
        return models
      }),
      nextArg: (function*(): Generator<removeModel<K, M["type"]>, void> {
        yield Action("remove_model", (scope) => {
          scope.event({
            type: "model_removed",
            modelKey,
            modelType: model.type,
          })
          return {
            ...scope,
            ...applyToModels(scope, model, (models) => {
              models.delete(model)
              return models
            }),
            nextArg: undefined,
          }
        })
      })(),
    }
  })
}
