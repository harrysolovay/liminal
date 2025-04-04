import type { JSONValue } from "../util/JSONValue.ts"
import { _object, type _ObjectFields, type JSONObjectType } from "./_object.ts"
import type { JSONArrayType } from "./array.ts"
import type { JSONBooleanType } from "./boolean.ts"
import { type JSONConstType } from "./const.ts"
import type { JSONEnumType } from "./enum.ts"
import type { JSONIntegerType } from "./integer.ts"
import type { JSONRootType } from "./JSONRootType.ts"
import { JSONSchema$schema } from "./JSONRootType.ts"
import type { JSONRootableType, JSONType } from "./JSONType"
import type { JSONNullType } from "./null.ts"
import type { JSONNumberType } from "./number.ts"
import type { JSONRefType } from "./ref.ts"
import { type JSONStringType } from "./string.ts"
import { type Type } from "./Type.ts"
import { TypeContext } from "./TypeContext.ts"
import { isParentType, TypeVisitor } from "./TypeVisitor.ts"
import type { JSONUnionType } from "./union.ts"

export function toJSON<T extends JSONValue, J extends JSONRootableType>(this: Type<T, J>): JSONRootType<J> {
  const { $defs: { 0: root, ...$defs } } = new ToJSONContext(this)
  return {
    $schema: JSONSchema$schema,
    ...root,
    $defs,
  } as never
}

class ToJSONContext extends TypeContext {
  readonly $defs: Record<string, JSONType | undefined> = {}
  constructor(root: Type) {
    super(root)
    visit(this, root)
  }
}

const visit = TypeVisitor<ToJSONContext, JSONType>({
  hook(next, state, type) {
    if (isParentType(type)) {
      const id = state.id(type)
      if (!(id in state.$defs)) {
        state.$defs[id] = undefined
        state.$defs[id] = next(state, type)
      }
      return type === state.root ? { $ref: "$" } : { $ref: `#/$defs/${id}` }
    }
    return next(state, type)
  },
  null(): JSONNullType {
    return { type: "null" }
  },
  boolean(): JSONBooleanType {
    return { type: "boolean" }
  },
  integer(): JSONIntegerType {
    return { type: "integer" }
  },
  number(): JSONNumberType {
    return { type: "number" }
  },
  string(): JSONStringType {
    return { type: "string" }
  },
  const(state, _type, valueType, value): JSONConstType {
    const initial = visit(state, valueType)
    return Object.assign(initial as Exclude<typeof initial, JSONRefType>, {
      const: value,
    })
  },
  array(state, _type, element): JSONArrayType {
    return {
      type: "array",
      items: visit(state, element),
    }
  },
  enum(_state, _type, ...values): JSONEnumType {
    return {
      type: "string",
      enum: values,
    }
  },
  union(state, _type, ...members): JSONUnionType {
    return {
      anyOf: members.map((member) => visit(state, member)),
    }
  },
  _object(state, _type, fields): JSONObjectType {
    return {
      type: "object",
      properties: Object.fromEntries(
        Array.isArray(fields)
          ? fields.map((value, i) => [i, visit(state, value)])
          : Object.entries(fields).map(([key, value]) => [key, visit(state, value)]),
      ),
      required: Object.keys(fields),
      additionalProperties: false,
    }
  },
  ref(state, _type, getType): JSONRefType {
    return visit(state, getType()) as JSONRefType
  },
})
