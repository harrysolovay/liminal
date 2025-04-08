import { Action } from "../Action.ts"
import type { RunInfer } from "../adapters.ts"
import type { LanguageModelSet } from "../events/LanguageModelSet.ts"
import type { MakeSpec } from "../Spec.ts"
import type { JSONKey } from "../util/JSONKey.ts"

export interface setLanguageModel<K extends JSONKey>
  extends Action<"set_language_model", MakeSpec<{ Event: LanguageModelSet<K> }>>
{}

export function* setLanguageModel<K extends JSONKey>(
  modelKey: K,
  runInfer: RunInfer,
): Generator<setLanguageModel<K>, void> {
  return yield Action("set_language_model", (scope) => {
    scope.event({
      type: "language_model_set",
      modelKey,
    })
    return {
      ...scope,
      nextArg: undefined,
      runInfer,
    }
  })
}
