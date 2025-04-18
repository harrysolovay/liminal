import type { JSONValue } from "../JSON/JSONValue.ts"

export interface LJSONSchemaString {
  type: "string"
  enum?: Array<string>
  const?: JSONValue
}
