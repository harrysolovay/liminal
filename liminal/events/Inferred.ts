import type { JSONValue } from "../util/JSONValue.ts"
import type { EventBase } from "./EventBase.ts"

export interface Inferred extends EventBase<"inferred"> {
  value: JSONValue
}
