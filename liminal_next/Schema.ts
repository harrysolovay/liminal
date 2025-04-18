import type { JSONValue } from "liminal-shapes"

export interface Schema<T extends JSONValue = JSONValue> {
  ""?: { T: T }
  schema: object
}
