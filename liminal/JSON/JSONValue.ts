import type { JSONObject } from "./JSONObject.ts"

export type JSONValue = null | boolean | number | string | Array<JSONValue> | JSONObject
