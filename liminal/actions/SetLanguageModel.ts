import type {} from "./actions_base.ts"
import type { Actor } from "../Actor.ts"
import type { Scope } from "../Scope.ts"
import type { Spec } from "../Spec.ts"
import { ActionBase, type ActionEventBase } from "./actions_base.ts"
import type { Infer } from "./Infer.ts"
import type { InferStream } from "./InferStream.ts"
import type { AssistantMessage, ToolMessage } from "./messages.ts"

export interface SetLanguageModel<S extends Spec = Spec> extends ActionBase<"set_language_model", S> {
  key: keyof any
  runInfer: RunInfer
}

export type RunInfer = (action: Infer, scope: Scope) => Actor<AssistantMessage | ToolMessage, any>

export type RunInferStream = (
  action: InferStream,
  scope: Scope,
  progress: (partial: any) => void,
) => Actor<AssistantMessage | ToolMessage, any>

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

export interface SetLanguageModelWithStreamingAction<S extends Spec = Spec>
  extends ActionBase<"set_language_model", S>
{
  key: keyof any
  runInfer: RunInfer
  runInferStream: RunInferStream
}

export function* setLanguageModelWithStreaming<K extends keyof any>(
  key: K,
  runInfer: RunInfer,
  runInferStream: RunInferStream,
): Generator<
  SetLanguageModelWithStreamingAction<{
    Entry: never
    Event: LanguageModelSetEvent<K>
  }>,
  void
> {
  return yield ActionBase("set_language_model", {
    key,
    runInfer,
    runInferStream,
    reduce(scope) {
      scope.events.emit({
        type: "language_model_set",
        key,
      })
      return scope.spread({
        next: undefined,
        runInfer,
        runInferStream,
      })
    },
  })
}
