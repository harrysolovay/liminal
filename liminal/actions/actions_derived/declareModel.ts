import type { Model } from "../../Model.ts"
import type { JSONKey } from "../../util/JSONKey.ts"
import { declareArg } from "../declareArg.ts"
import { pushModel } from "../pushModel.ts"

export function* declareModel<K extends JSONKey>(key: K) {
  const model = yield* declareArg(key)<Model>()
  return yield* pushModel(key, model)
}
