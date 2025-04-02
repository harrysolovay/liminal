import type { ActionEventBase } from "../Action/ActionEventBase.ts"
import type { JSONValue } from "../util/JSONValue.ts"

export interface InferenceRequestedEvent extends ActionEventBase<"inference_requested"> {}

export interface InferredEvent<V extends JSONValue = JSONValue> extends ActionEventBase<"inferred"> {
  value: V
}
