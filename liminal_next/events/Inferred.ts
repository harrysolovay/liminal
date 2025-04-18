import type { JSONValue } from "liminal-schema"
import type { LEventBase } from "./_LEventBase.ts"

export interface Inferred extends LEventBase<"inferred"> {
  value: JSONValue
}
