import type { StandardSchemaV1 } from "@standard-schema/spec"
import { Action } from "../Action.ts"
import type { InferenceRequested } from "../events/InferenceRequested.ts"
import type { Inferred } from "../events/Inferred.ts"
import type { JSONObject } from "../util/JSONObject.ts"
import type { JSONValue } from "../util/JSONValue.ts"

export function infer(): Generator<
  Action<"infer", {
    Event: InferenceRequested | Inferred<string>
    Child: never
    Entry: never
    Throw: never
  }>,
  string
>
export function infer<O extends JSONValue>(
  type: StandardSchemaV1<JSONObject, O>,
): Generator<
  Action<"infer", {
    Event: InferenceRequested | Inferred<O>
    Child: never
    Entry: never
    Throw: never
  }>,
  O
>
export function* infer(type?: StandardSchemaV1<JSONObject>): Generator<Action<"infer">, any> {
  return yield Action("infer", async (scope) => {
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
