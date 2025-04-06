import type { StandardSchemaV1 } from "@standard-schema/spec"
import { Action } from "../Action.ts"
import type { InferenceRequestedEvent } from "../events/InferenceRequestedEvent.ts"
import type { InferredEvent } from "../events/InferredEvent.ts"
import { assert } from "../util/assert.ts"
import type { JSONObject } from "../util/JSONObject.ts"
import type { JSONValue } from "../util/JSONValue.ts"

export function infer(): Generator<
  Action<"infer", {
    Entry: never
    Event: InferenceRequestedEvent | InferredEvent<string>
    Throw: never
  }>,
  string
>
export function infer<O extends JSONValue>(
  type: StandardSchemaV1<JSONObject, O>,
): Generator<
  Action<"infer", {
    Entry: never
    Event: InferenceRequestedEvent | InferredEvent<O>
    Throw: never
  }>,
  O
>
export function* infer(type?: StandardSchemaV1<JSONObject>): Generator<Action<"infer">, any> {
  return yield Action("infer", async (scope) => {
    assert(scope.runInfer)
    scope.event({
      type: "inference_requested",
    })
    scope = await scope.reduce(scope.runInfer(type))
    scope.event({
      type: "inferred",
      value: scope.value,
    })
    return {
      ...scope,
      nextArg: scope.value,
    }
  })
}
