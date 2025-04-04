import type { JSONKey } from "./JSONKey.ts"
import type { JSONValue } from "./JSONValue.ts"

export type JSONObject = {
  [value: JSONKey]: JSONValue
}
