import type { StandardSchemaV1 } from "@standard-schema/spec"
import { ActionBase } from "../Action/ActionBase.js"
import type { Spec } from "../Spec.js"
import type { JSONObject } from "../JSON/JSONObject.js"
import type { GenerationEvent } from "./GenerationEvent.js"

export interface Generation<S extends Spec = Spec> extends ActionBase<"Generation", S> {
  type: StandardSchemaV1 | undefined
}

export function Generation(): Generator<
  Generation<{
    LanguageModel: never
    EmbeddingModel: never
    Event: GenerationEvent<string>
  }>,
  string
>
export function Generation<O extends JSONObject>(
  type: StandardSchemaV1<JSONObject, O>,
): Generator<
  Generation<{
    LanguageModel: never
    EmbeddingModel: never
    Event: GenerationEvent<O>
  }>,
  O
>
export function* Generation(type?: StandardSchemaV1): Generator<Generation, unknown> {
  return yield ActionBase("Generation", { type })
}
