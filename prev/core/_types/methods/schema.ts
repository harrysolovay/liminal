import { WeakMemo } from "../../../../util/WeakMemo.ts"
import { RecursiveVisitorState } from "../../_RecursiveVisitorState.ts"
import { Visitor } from "../../_Visitor.ts"
import type { JSONType } from "../../JSONType.ts"
import { Type } from "../../Type.ts"
import { array, object, union } from "../mod.ts"

export const { getOrInit: schema } = new WeakMemo<Type, JSONType>((type) => {
  const root = type.self() === object ? type : object({ _lmnl: type })
  return visit(new SchemaState(root, new Map()), type)
})

class SchemaState extends RecursiveVisitorState {
  $defs: Record<string, undefined | JSONType> = {}
}

const visit = Visitor<typeof Type, SchemaState, JSONType>(Type, {
  hook(next, state, type) {
    if (canBeRecursive(type)) {
      const id = state.id(type)
      if (id in state.$defs) {
        return type === state.root ? { $ref: "#" } : { $ref: `#/$defs/${id}` }
      }
      state.$defs[id] = undefined
      const def = {
        ...next(state, type),
        description: type.description(),
      }
      if (type !== state.root) {
        state.$defs[id] = def
      }
      return def
    }
    return {
      ...next(state, type),
      description: type.description(),
    }
  },
  null() {
    return { type: "null" }
  },
  boolean() {
    return { type: "boolean" }
  },
  integer() {
    return { type: "integer" }
  },
  number() {
    return { type: "number" }
  },
  string() {
    return { type: "string" }
  },
  const(state, _1, valueType, value): JSONType {
    return {
      ...visit(state, valueType),
      const: value,
    }
  },
  array(state, _1, element): JSONType {
    return {
      type: "array",
      items: visit(state, element),
    }
  },
  object(state, type, fields): JSONType {
    const rest = type === state.root
      ? (() => {
        const { "0": _, ...$defs } = state.$defs
        return Object.keys($defs).length ? { $defs } : {}
      })()
      : {}
    return {
      type: "object",
      properties: Object.fromEntries(
        Object.entries(fields).map(([key, type]) => [key, visit(state, type)]),
      ),
      required: Object.keys(fields),
      additionalProperties: false,
      ...rest,
    }
  },
  enum(_0, _1, ...values) {
    return {
      type: "string",
      enum: values,
    }
  },
  union(state, _1, ...members): JSONType {
    return {
      anyOf: members.map((member) => visit(state, member)),
    }
  },
  deferred(state, _1, get): JSONType {
    return visit(state, get())
  },
})

function canBeRecursive(type: Type): boolean {
  switch (type.self()) {
    case array:
    case object:
    case union: {
      return true
    }
    default: {
      return false
    }
  }
}
