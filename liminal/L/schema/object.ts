import type { Schema, SchemaObject } from "../../Schema.ts"
import { make } from "./_schema_common.ts"

interface object_<F extends Record<string, Schema> = Record<string, Schema>>
  extends SchemaObject<{ [K in keyof F]: F[K]["T"] }>
{
  properties: F
  required: Array<Extract<keyof F, string>>
}

function object_<XR extends Record<string, Schema>>(properties: XR): object_<XR> {
  return make({
    type: "object",
    properties,
    additionalProperties: false,
    required: Object.keys(properties) as never,
  })
}

Object.defineProperty(object_, "name", { value: "object" })
export { object_ as object }
