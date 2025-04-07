import type { JSONValue } from "../util/JSONValue.ts"
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
import { _object, type JSONObjectType } from "./object.ts"
import { type JSONStringType } from "./string.ts"
import { type Type } from "./Type.ts"
import { PARENT_TYPE_NAMES, typeName } from "./type_common.ts"
import { TypeContext } from "./TypeContext.ts"
import { TypeVisitor } from "./TypeVisitor.ts"
import type { JSONUnionType } from "./union.ts"

export function toJSON<T extends JSONValue, J extends JSONRootableType>(this: Type<T, J>): JSONRootType<J> {
  const { $defs: { 0: root, ...$defs } } = new ToJSONState(this)
  return {
    $schema: JSONSchema$schema,
    ...root,
    $defs,
  } as never
}

class ToJSONState extends TypeContext {
  readonly $defs: Record<string, JSONType | undefined> = {}
  constructor(root: Type) {
    super(root)
    visit(this, root)
  }
}

const visit: TypeVisitor<ToJSONState, JSONType> = TypeVisitor({
  hook(next, state, type) {
    const which = typeName(type)
    if (PARENT_TYPE_NAMES[which]) {
      const id = state.id(type)
      if (!(id in state.$defs)) {
        state.$defs[id] = undefined
        state.$defs[id] = next(state, type)
      }
      return type === state.root ? { $ref: "$" } : { $ref: `#/$defs/${id}` }
    }
    if (which === "ref") {
      if (state.ids.has(type)) {
        const getType = type.args?.[0] as () => Type
        return { $ref: `#/$defs/${state.id(getType())}` }
      }
      state.id(type)
      return next(state, type)
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
    return {
      ...visit(state, valueType),
      const: value,
    } as never
  },
  _array(state, _type, element): JSONArrayType {
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
  _union(state, _type, ...members): JSONUnionType {
    return {
      anyOf: members.map((m) => visit(state, m)),
    }
  },
  _object(state, _type, fields): JSONObjectType {
    return {
      type: "object",
      properties: Object.fromEntries(
        Array.isArray(fields)
          ? fields.map((v, i) => [i, visit(state, v)])
          : Object.entries(fields).map(([k, v]) => [k, visit(state, v)]),
      ),
      required: Object.keys(fields),
      additionalProperties: false,
    }
  },
  ref(state, _type, getType) {
    return visit(state, getType())
  },
})
