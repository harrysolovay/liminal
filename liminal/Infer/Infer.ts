import type { StandardSchemaV1 } from "@standard-schema/spec"
import { ActionBase } from "../Action/ActionBase.js"
import type { JSONObject } from "../JSON/JSONObject.js"
import type { Spec } from "../Spec.js"
import type { InferredEvent } from "./InferEvent.js"

export interface Infer<S extends Spec = Spec> extends ActionBase<"infer", S> {
  type: StandardSchemaV1 | undefined
}

export function Infer(): Generator<
  Infer<{
    LanguageModel: never
    EmbeddingModel: never
    Event: InferredEvent<string>
  }>,
  string
>
export function Infer<O extends JSONObject>(
  type: StandardSchemaV1<JSONObject, O>,
): Generator<
  Infer<{
    LanguageModel: never
    EmbeddingModel: never
    Event: InferredEvent<O>
  }>,
  O
>
export function* Infer(type?: StandardSchemaV1): Generator<Infer, unknown> {
  return yield ActionBase("infer", { type })
}
