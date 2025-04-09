import { setLanguageModel } from "../../actions/setLanguageModel.ts"
import type { RunInfer } from "../../adapters.ts"
import type { JSONKey } from "../../util/JSONKey.ts"
import { declareArg } from "../declareArg.ts"

export function* declareLanguageModel<K extends JSONKey>(key: K) {
  const runInfer = yield* declareArg(key)<RunInfer>()
  return yield* setLanguageModel(key, runInfer)
}
