import type { ActionEventBase } from "../Action/ActionEventBase.js"
import type { JSONObject } from "../JSON/JSONObject.js"

export interface InferredEvent<V extends string | JSONObject = string | JSONObject>
  extends ActionEventBase<"inferred">
{
  value: V
  schema?: object
}
