import type { StandardSchemaV1 } from "@standard-schema/spec"
import { ActionBase } from "../Action/ActionBase.js"
import type { JSONObject } from "../JSON/JSONObject.js"
import type { Spec } from "../Spec.js"
import type { InferenceEvent } from "./InferenceEvent.js"

export interface Inference<S extends Spec = Spec> extends ActionBase<"Inference", S> {
  type: StandardSchemaV1 | undefined
}

export function Inference(): Generator<
  Inference<{
    LanguageModel: never
    EmbeddingModel: never
    Event: InferenceEvent<string>
  }>,
  string
>
export function Inference<O extends JSONObject>(
  type: StandardSchemaV1<JSONObject, O>,
): Generator<
  Inference<{
    LanguageModel: never
    EmbeddingModel: never
    Event: InferenceEvent<O>
  }>,
  O
>
export function* Inference(type?: StandardSchemaV1): Generator<Inference, unknown> {
  return yield ActionBase("Inference", { type })
}
