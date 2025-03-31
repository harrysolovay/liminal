import type { JSONValue } from "./JSONValue.ts"

export type JSONObject = {
  [value: string]: JSONValue
}
