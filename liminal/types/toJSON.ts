import type { JSONValue } from "../util/JSONValue.ts"
import type { JSONArrayType } from "./array.ts"
import type { JSONBooleanType } from "./boolean.ts"
import type { JSONConstType } from "./const.ts"
import type { JSONEnumType } from "./enum.ts"
import type { JSONIntegerType } from "./integer.ts"
import type { JSONRootType } from "./JSONRootType.ts"
import { JSONSchema$schema } from "./JSONRootType.ts"
import type { ConstableType, JSONRootableType, JSONType } from "./JSONType"
import type { JSONNumberType } from "./number.ts"
import { type JSONObjectType, object, type ObjectFields } from "./object.ts"
import { RecursiveTypeVisitorState } from "./RecursiveTypeVisitorState.ts"
import type { JSONRefType } from "./ref.ts"
import type { JSONStringType } from "./string.ts"
import { isType, type Type } from "./Type.ts"
import { allowsRecursion, TypeVisitor } from "./TypeVisitor.ts"
import type { JSONUnionType } from "./union.ts"

export function toJSON<T extends JSONValue, J extends JSONRootableType>(
  this: Type<T, J>,
): J extends JSONRootableType ? JSONRootType<J> : J {
  const state = new ToJSONState(this)
  const jsonType = visit(state, this)
  if (allowsRecursion(this)) {
    const { $defs } = state
    return {
      $schema: JSONSchema$schema,
      ...jsonType,
      $defs,
    } as never
  }
  return jsonType as never
}

class ToJSONState extends RecursiveTypeVisitorState {
  $defs: Record<string, undefined | ConstableType> = {}
}

const visit = TypeVisitor<ToJSONState, JSONType>({
  hook(next, state, type): JSONType {
    if (allowsRecursion(type)) {
      const id = state.id(type)
      if (id in state.$defs) {
        return type === state.root ? { $ref: "$" } : { $ref: `#/$defs/${id}` }
      }
      state.$defs[id] = undefined
      const jsonType = {
        ...next(state, type) as ConstableType,
        description: type.descriptions?.join("\n"),
      }
      if (type !== state.root) {
        state.$defs[id] = jsonType
      }
      return jsonType
    }
    return next(state, type)
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
  object(state, _type, fields): JSONObjectType {
    return {
      type: "object",
      fields: Object.fromEntries(
        Array.isArray(fields)
          ? fields.map((value, i) => [i, visitObjectFieldValue(state, value)])
          : Object.entries(fields).map(([key, value]) => [key, visitObjectFieldValue(state, value)]),
      ),
      required: Object.keys(fields),
    }
  },
  ref(state, _type, getType): JSONRefType {
    return visit(state, getType()) as JSONRefType
  },
})

function visitObjectFieldValue(state: ToJSONState, value: string | ObjectFields | Type): JSONType {
  return typeof value === "string"
    ? {
      type: "string",
      const: value,
    }
    : visit(state, isType(value) ? value : object(value))
}
