import type { StandardSchemaV1 } from "@standard-schema/spec"
import { ActionBase } from "../Action/ActionBase.ts"
import type { Spec } from "../Spec.ts"
import type { JSONValue } from "../util/JSONValue.ts"
import type { InferenceRequestedEvent, InferredEvent } from "./InferEvent.ts"

export interface Infer<S extends Spec = Spec> extends ActionBase<"infer", S> {
  type: StandardSchemaV1 | undefined
}

export function infer(): Generator<
  Infer<{
    Field: never
    Event: InferenceRequestedEvent | InferredEvent<string>
  }>,
  string
>
export function infer<O extends JSONValue>(
  type: StandardSchemaV1<JSONValue, O>,
): Generator<
  Infer<{
    Field: never
    Event: InferenceRequestedEvent | InferredEvent<O>
  }>,
  O
>
export function* infer(type?: StandardSchemaV1): Generator<Infer, unknown> {
  return yield ActionBase("infer", { type })
}
