import type { ActionEventBase } from "../Action/ActionEventBase.ts"
import type { JSONObject } from "../JSON/JSONObject.ts"

export interface InferredEvent<V extends string | JSONObject = string | JSONObject>
  extends ActionEventBase<"inferred">
{
  value: V
  schema?: object
}
