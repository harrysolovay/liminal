import type { ActionEventBase } from "../Action/ActionEventBase.ts"
import type { JSONObject } from "../JSON/JSONObject.ts"

export interface InferenceRequestedEvent extends ActionEventBase<"inference_requested"> {}

export interface InferredEvent<V extends string | JSONObject = string | JSONObject>
  extends ActionEventBase<"inferred">
{
  value: V
}
