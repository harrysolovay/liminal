import type { Action } from "../Action.ts"
import { arg } from "../actions/Arg.ts"
import { setLanguageModel } from "../actions/SetLanguageModel.ts"
import type { RunInfer } from "../adapters.ts"
import type { LanguageModelSetEvent } from "../events/LanguageModelSetEvent.ts"

export function* declareLanguageModel<K extends keyof any>(key: K): Generator<
  Action<"arg" | "set_language_model", {
    Entry: [K, RunInfer]
    Event: LanguageModelSetEvent<K>
    Throw: never
  }>,
  void
> {
  const runInfer = yield* arg(key)<RunInfer>()
  return yield* setLanguageModel(key, runInfer)
}
