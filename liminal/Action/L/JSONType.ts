import type { Expand } from "../../util/Expand.js"

export type JSONType = JSONTypes[keyof JSONTypes]
export type JSONTypes = JSONTypes.Make<{
  null: {
    type: "null"
  }
  boolean: {
    type: "boolean"
  }
  integer: {
    type: "integer"
  }
  number: {
    type: "number"
  }
  string: {
    type: "string"
    enum?: Array<string>
  }
  array: {
    type: "array"
    items: JSONType
  }
  object: {
    type: "object"
    properties: Record<string, undefined | JSONType>
    additionalProperties: false
    required: Array<string>
    $defs?: Record<string, undefined | JSONType>
  }
  union: {
    anyOf: Array<JSONType>
  }
  ref: {
    $ref: string
  }
}>
namespace JSONTypes {
  export type Make<T> = {
    [K in keyof T]: Expand<
      T[K] & {
        description?: string
        const?: unknown
      }
    >
  }
}
