import type { JSONValue } from "liminal-shapes"
import type { LEventBase } from "./_LEventBase.ts"

export interface Inferred extends LEventBase<"inferred"> {
  value: JSONValue
}
