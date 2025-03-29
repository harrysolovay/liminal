import type { StandardSchemaV1 } from "@standard-schema/spec"
import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./EventBase.js"
import type { JSONObject } from "../util/JSONValue.js"
import type { Spec } from "../Spec.js"

export interface Generation<S extends Spec = Spec> extends ActionBase<"Generation", S> {
  type: StandardSchemaV1 | undefined
}

export function Generation(): Generator<
  Generation<{
    LanguageModel: never
    EmbeddingModel: never
    Event: GenerateEvent<string>
  }>,
  string
>
export function Generation<O extends JSONObject>(
  type: StandardSchemaV1<JSONObject, O>,
): Generator<
  Generation<{
    LanguageModel: never
    EmbeddingModel: never
    Event: GenerateEvent<O>
  }>,
  O
>
export function* Generation(type?: StandardSchemaV1): Generator<Generation, unknown> {
  return yield ActionBase("Generation", { type })
}

export interface GenerateEvent<V extends string | JSONObject = string | JSONObject> extends EventBase<"Generation"> {
  value: V
  schema?: object
}
