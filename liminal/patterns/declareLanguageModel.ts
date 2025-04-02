import { type Arg, arg } from "../actions/Arg.ts"
import { type RunInfer, type SetLanguageModel, setLanguageModel } from "../actions/SetLanguageModel.ts"
import type { LanguageModelSetEvent } from "../actions/SetLanguageModel.ts"

export function* declareLanguageModel<K extends keyof any>(key: K): Generator<
  | Arg<{
    Entry: [K, RunInfer]
    Event: never
  }>
  | SetLanguageModel<{
    Entry: never
    Event: LanguageModelSetEvent<K>
  }>,
  void
> {
  const runInfer = yield* arg(key)<RunInfer>()
  return yield* setLanguageModel(key, runInfer)
}
