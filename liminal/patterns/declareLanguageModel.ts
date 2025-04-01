import { arg } from "../Arg/Arg.ts"
import { type RunInfer, setLanguageModel } from "../SetLanguageModel/SetLanguageModel.ts"

export function* declareLanguageModel<K extends keyof any>(key: K) {
  const runInfer = yield* arg(key)<RunInfer>()
  return yield* setLanguageModel(key, runInfer)
}
