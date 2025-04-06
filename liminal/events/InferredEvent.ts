import type { JSONValue } from "../util/JSONValue.ts"
import type { EventBase } from "./_EventBase.ts"

export interface InferredEvent<V extends JSONValue = JSONValue> extends EventBase<"inferred"> {
  value: V
}
