import type { StandardSchemaV1 } from "@standard-schema/spec"
import { Action } from "../Action.ts"
import type { InferenceRequested } from "../events/InferenceRequested.ts"
import type { Inferred } from "../events/Inferred.ts"
import type { MakeSpec } from "../Spec.ts"
import type { JSONObject } from "../util/JSONObject.ts"
import type { JSONValue } from "../util/JSONValue.ts"

export function* infer<T extends JSONValue = string>(type?: StandardSchemaV1<JSONObject, T>): Generator<
  Action<
    "infer",
    MakeSpec<{
      Event: InferenceRequested | Inferred
    }>
  >,
  T
> {
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
