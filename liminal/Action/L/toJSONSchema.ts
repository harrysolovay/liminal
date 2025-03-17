import type { JSONType } from "./JSONType.js"
import { isL } from "./isL.js"
import type { L } from "./L.js"
import { RecursiveTypeVisitorState } from "./RecursiveTypeVisitorState.js"
import { TypeVisitor } from "./TypeVisitor.js"
import type { StructFields } from "./intrinsics/struct.js"
import { WeakMemo } from "../../util/WeakMemo.js"

export function toJSONSchema(this: L): JSONType {
  return memo(this)
}

const memo = WeakMemo((type: L) => {
  return visit(new SchemaState(type, new Map()), type)
})

class SchemaState extends RecursiveTypeVisitorState {
  $defs: Record<string, undefined | JSONType> = {}
}

const visit = TypeVisitor<SchemaState, JSONType>({
  boolean() {
    return {
      type: "boolean",
    }
  },
  integer() {
    return {
      type: "integer",
    }
  },
  string() {
    return {
      type: "string",
    }
  },
  array(state, _1, elementType): JSONType {
    return {
      type: "array", // TODO
      items: visit(state, elementType),
    }
  },
  enum(_0, _1, values) {
    return {
      type: "string" as never,
      enum: values,
    }
  },
  struct(state, _1, fields): JSONType {
    return child(state, fields)
    function child(state: SchemaState, fields: StructFields): JSONType {
      const common = {
        type: "object" as never,
        additionalProperties: false,
      }
      if (Array.isArray(fields)) {
        return {
          ...common,
          properties: Object.fromEntries(fields.map((v, i) => [i, isL(v) ? visit(state, v) : child(state, v)])),
          required: Array.from(fields, (_0, i) => i.toString()),
        }
      }
      return {
        ...common,
        properties: Object.fromEntries(
          Object.entries(fields).map(([k, v]) => [k, isL(v) ? visit(state, v) : child(state, v)]),
        ),
        required: Object.keys(fields),
      }
    }
  },
})
