import type { Actor } from "../Actor.ts"
import type { Scope } from "../Scope.ts"
import type { Spec } from "../Spec.ts"
import { ActionBase, type EventBase } from "./actions_base.ts"
import type { AppendMessage } from "./AppendMessage.ts"
import type { Infer } from "./Infer.ts"

export interface SetLanguageModel<S extends Spec = Spec> extends ActionBase<"set_language_model", S> {
  key: keyof any
  runInfer: RunInfer
}

export type RunInfer = (action: Infer, scope: Scope) => Actor<AppendMessage, any>

export function* setLanguageModel<K extends keyof any>(
  key: K,
  runInfer: RunInfer,
): Generator<
  SetLanguageModel<{
    Entry: never
    Event: LanguageModelSetEvent<K>
  }>,
  void
> {
  return yield ActionBase("set_language_model", {
    key,
    runInfer,
    reduce(scope) {
      scope.event({
        type: "language_model_set",
        key,
      })
      return {
        ...scope,
        nextArg: undefined,
        runInfer,
      }
    },
  })
}

export interface LanguageModelSetEvent<K extends keyof any = keyof any> extends EventBase<"language_model_set"> {
  key: K
}
