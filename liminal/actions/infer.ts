import type { StandardSchemaV1 } from "@standard-schema/spec"
import { Action } from "../Action.ts"
import type { InferenceRequested } from "../events/InferenceRequested.ts"
import type { Inferred } from "../events/Inferred.ts"
import type { Spec } from "../Spec.ts"
import type { JSONObject } from "../util/JSONObject.ts"
import type { JSONValue } from "../util/JSONValue.ts"
import { peekLast } from "../util/peekLast.ts"

export { infer_ as infer }

interface infer_<_T> extends
  Action<
    "infer",
    Spec.Make<{
      Event: InferenceRequested | Inferred
    }>
  >
{}

const infer_ = Object.assign(
  function* infer_<T extends JSONValue>(type: StandardSchemaV1<JSONObject, T>): Generator<infer_<T>, T> {
    return yield* impl(type)
  },
  {
    *[Symbol.iterator](): Iterator<infer_<string>, string> {
      return yield* impl()
    },
  },
)
Object.defineProperty(infer_, "name", { value: "infer" })

function* impl(type?: StandardSchemaV1<JSONObject, any>): Generator<infer_<any>, any> {
  return yield Action("infer", async (scope) => {
    scope.event({
      type: "inference_requested",
    })
    const model = peekLast(scope.languageModels)!
    scope = await scope.reduce(model.infer(type))
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
