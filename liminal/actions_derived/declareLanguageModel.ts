import type { Action } from "../Action.ts"
import { arg } from "../actions/arg.ts"
import { setLanguageModel } from "../actions/setLanguageModel.ts"
import type { RunInfer } from "../adapters.ts"
import type { LanguageModelSetEvent } from "../events/LanguageModelSetEvent.ts"
import type { JSONKey } from "../util/JSONKey.ts"

export function* declareLanguageModel<K extends JSONKey>(key: K): Generator<
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
