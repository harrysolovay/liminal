import type { JSONType } from "./JSONType.js"
import { isType } from "./isType.js"
import type { Type } from "./Type.js"
import { RecursiveTypeVisitorState } from "./RecursiveTypeVisitorState.js"
import { TypeVisitor } from "./TypeVisitor.js"
import type { ObjectFields } from "./intrinsics/object.js"
import { WeakMemo } from "../../util/WeakMemo.js"

export function toJSONSchema(this: Type): JSONType {
  return memo(this)
}

const memo = WeakMemo((type: Type) => {
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
  object(state, _1, fields): JSONType {
    return child(state, fields)
    function child(state: SchemaState, fields: ObjectFields): JSONType {
      const common = {
        type: "object" as never,
        additionalProperties: false,
      }
      if (Array.isArray(fields)) {
        return {
          ...common,
          properties: Object.fromEntries(
            fields
              .filter((v) => typeof v !== "string")
              .map((v, i) => [i, isType(v) ? visit(state, v) : child(state, v)]),
          ),
          required: Array.from(fields, (_0, i) => i.toString()),
        }
      }
      return {
        ...common,
        properties: Object.fromEntries(
          Object.entries(fields)
            .filter(([_0, v]) => typeof v !== "string")
            // TODO: cleanup
            .map(([k, v]) => [k, isType(v) ? visit(state, v) : child(state, v as ObjectFields)]),
        ),
        required: Object.keys(fields),
      }
    }
  },
})
