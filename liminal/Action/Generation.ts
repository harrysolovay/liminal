import type { StandardSchemaV1 } from "@standard-schema/spec"
import { ActionBase } from "./ActionBase.js"
import type { EventBase } from "./event_common.js"
import type { JSONValue } from "../util/JSONValue.js"
import type { Spec } from "../Spec.js"

export function Generation(): Generator<
  Generation<{
    LanguageModel: never
    EmbeddingModel: never
    Event: GenerateEvent<string>
  }>,
  string
>
export function Generation<O extends JSONValue>(
  type: StandardSchemaV1<object, O>,
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

export interface Generation<S extends Spec = Spec> extends ActionBase<"Generation", S> {
  type: StandardSchemaV1 | undefined
}

export interface GenerateEvent<V extends JSONValue = JSONValue> extends EventBase<"Generation"> {
  value: V
  schema?: object
}
