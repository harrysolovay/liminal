import type { EventBase } from "../Action/ActionEventBase.js"
import type { JSONObject } from "../JSON/JSONObject.js"

export interface GenerationEvent<V extends string | JSONObject = string | JSONObject> extends EventBase<"Generation"> {
  value: V
  schema?: object
}
