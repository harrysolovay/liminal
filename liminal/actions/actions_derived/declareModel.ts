import type { Models, ModelType } from "../../Model.ts"
import type { JSONKey } from "../../util/JSONKey.ts"
import { declareArg } from "../declareArg.ts"
import { pushModel } from "../pushModel.ts"

export function* declareModel<K extends JSONKey, M extends ModelType>(key: K, _modelType: M) {
  const model = yield* declareArg(key)<Models[M]>()
  return yield* pushModel(key, model)
}
