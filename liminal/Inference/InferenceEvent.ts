import type { ActionEventBase } from "../Action/ActionEventBase.js"
import type { JSONObject } from "../JSON/JSONObject.js"

export interface InferenceEvent<V extends string | JSONObject = string | JSONObject>
  extends ActionEventBase<"Inference">
{
  value: V
  schema?: object
}
