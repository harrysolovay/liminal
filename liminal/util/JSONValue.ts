export type JSONValue = null | boolean | number | string | Array<JSONValue> | JSONObject

export type JSONObject = {
  [value: string]: JSONValue
}
