import type {} from "./actions_base.ts"
import type { Actor } from "../Actor/Actor.ts"
import type { Scope } from "../Scope.ts"
import type { Spec } from "../Spec.ts"
import { ActionBase, type ActionEventBase } from "./actions_base.ts"
import type { AssistantMessage } from "./AssistantMessage.ts"
import type { Infer } from "./Infer.ts"
import type { ToolMessage } from "./ToolMessage.ts"

export interface SetLanguageModel<S extends Spec = Spec> extends ActionBase<"set_language_model", S> {
  key: keyof any
  runInfer: RunInfer
}

export type RunInfer = (action: Infer, scope: Scope) => Actor<AssistantMessage | ToolMessage, any>

export function* setLanguageModel<K extends keyof any>(
  key: K,
  runInfer: RunInfer,
): Generator<
  SetLanguageModel<{
    Field: never
    Event: LanguageModelSetEvent<K>
  }>,
  void
> {
  return yield ActionBase("set_language_model", {
    key,
    runInfer,
    reduce(scope) {
      scope.events.emit({
        type: "language_model_set",
        key,
      })
      return scope.spread({
        next: undefined,
        runInfer,
      })
    },
  })
}

export interface LanguageModelSetEvent<K extends keyof any = keyof any> extends ActionEventBase<"language_model_set"> {
  key: K
}
