import type { JSONObject } from "./JSONObject.js"

export type JSONValue = null | boolean | number | string | Array<JSONValue> | JSONObject
