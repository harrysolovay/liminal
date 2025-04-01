import { ActionBase } from "../Action/ActionBase.ts"
import type { Actor } from "../Actor/Actor.ts"
import type { AssistantMessage } from "../AssistantMessage/AssistantMessage.ts"
import type { Infer } from "../Infer/Infer.ts"
import type { Scope } from "../Scope/Scope.ts"
import type { Spec } from "../Spec.ts"
import type { ToolMessage } from "../ToolMessage/ToolMessage.ts"
import type { LanguageModelSetEvent } from "./SetLanguageModelEvent.ts"

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
  })
}
