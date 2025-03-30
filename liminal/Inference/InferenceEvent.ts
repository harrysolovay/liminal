import type { EventBase } from "../Action/ActionEventBase.js"
import type { JSONObject } from "../JSON/JSONObject.js"

export interface InferenceEvent<V extends string | JSONObject = string | JSONObject> extends EventBase<"Inference"> {
  value: V
  schema?: object
}
