import type { StandardSchemaV1 } from "@standard-schema/spec"
import type { Spec } from "../Spec.ts"
import { assert } from "../util/assert.ts"
import type { JSONValue } from "../util/JSONValue.ts"
import { ActionBase, type ActionEventBase } from "./actions_base.ts"

export interface Infer<S extends Spec = Spec> extends ActionBase<"infer", S> {
  type: StandardSchemaV1 | undefined
}

export function infer(): Generator<
  Infer<{
    Entry: never
    Event: InferenceRequestedEvent | InferredEvent<string>
  }>,
  string
>
export function infer<O extends JSONValue>(
  type: StandardSchemaV1<JSONValue, O>,
): Generator<
  Infer<{
    Entry: never
    Event: InferenceRequestedEvent | InferredEvent<O>
  }>,
  O
>
export function* infer(type?: StandardSchemaV1): Generator<Infer, unknown> {
  return yield ActionBase("infer", {
    type,
    async reduce(scope) {
      assert(scope.runInfer)
      scope.events.emit({
        type: "inference_requested",
      })
      scope = await scope.reduce(scope.runInfer(this, scope))
      scope.events.emit({
        type: "inferred",
        value: scope.result,
      })
      return scope.spread({ next: scope.result })
    },
  })
}

export interface InferenceRequestedEvent extends ActionEventBase<"inference_requested"> {}

export interface InferredEvent<V extends JSONValue = JSONValue> extends ActionEventBase<"inferred"> {
  value: V
}
