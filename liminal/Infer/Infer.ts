import type { StandardSchemaV1 } from "@standard-schema/spec"
import { ActionBase } from "../Action/ActionBase.ts"
import type { JSONObject } from "../JSON/JSONObject.ts"
import type { Spec } from "../Spec.ts"
import type { InferenceRequestedEvent, InferredEvent } from "./InferEvent.ts"

export interface Infer<S extends Spec = Spec> extends ActionBase<"infer", S> {
  type: StandardSchemaV1 | undefined
}

export function Infer(): Generator<
  Infer<{
    LanguageModel: never
    EmbeddingModel: never
    Event: InferenceRequestedEvent | InferredEvent<string>
  }>,
  string
>
export function Infer<O extends JSONObject>(
  type: StandardSchemaV1<JSONObject, O>,
): Generator<
  Infer<{
    LanguageModel: never
    EmbeddingModel: never
    Event: InferenceRequestedEvent | InferredEvent<O>
  }>,
  O
>
export function* Infer(type?: StandardSchemaV1): Generator<Infer, unknown> {
  return yield ActionBase("infer", { type })
}
