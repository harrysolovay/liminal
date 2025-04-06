import { Action } from "../Action.ts"
import type { RunInfer } from "../adapters.ts"
import type { LanguageModelSetEvent } from "../events/LanguageModelSetEvent.ts"

export function* setLanguageModel<K extends keyof any>(
  key: K,
  runInfer: RunInfer,
): Generator<
  Action<"set_language_model", {
    Entry: never
    Event: LanguageModelSetEvent<K>
    Throw: never
  }>,
  void
> {
  return yield Action("set_language_model", (scope) => {
    scope.event({
      type: "language_model_set",
      key,
    })
    return {
      ...scope,
      nextArg: undefined,
      runInfer,
    }
  })
}
