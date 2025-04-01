import { type Arg, arg } from "../Arg/Arg.ts"
import { type RunInfer, type SetLanguageModel, setLanguageModel } from "../SetLanguageModel/SetLanguageModel.ts"
import type { LanguageModelSetEvent } from "../SetLanguageModel/SetLanguageModelEvent.ts"

export function* declareLanguageModel<K extends keyof any>(key: K): Generator<
  | Arg<{
    Field: { [_ in K]: RunInfer }
    Event: never
  }>
  | SetLanguageModel<{
    Field: never
    Event: LanguageModelSetEvent<K>
  }>,
  void
> {
  const runInfer = yield* arg(key)<RunInfer>()
  return yield* setLanguageModel(key, runInfer)
}
