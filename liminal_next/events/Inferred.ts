import type { JSONValue } from "liminal-schema"

export interface Inferred {
  type: "inferred"
  value: JSONValue
}
