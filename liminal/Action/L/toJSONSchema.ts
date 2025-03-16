import type { JSONType } from "./JSONType.ts"
import { isL, type L } from "./L.ts"
import { RecursiveTypeVisitorState } from "./RecursiveTypeVisitorState.ts"
import { TypeVisitor } from "./TypeVisitor.ts"
import type { StructFields } from "./intrinsics/struct.ts"
import { WeakMemo } from "../../util/WeakMemo.ts"

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
      type: "array",
      items: visit(state, elementType),
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
