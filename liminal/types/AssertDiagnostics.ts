import { assert } from "../util/assert.ts"
import { assertJSONValueEquals } from "../util/assertJSONValueEquals.ts"
import type { JSONValue } from "../util/JSONValue.ts"
import type { _ObjectFields, _TupleFields } from "./_object.ts"
import type { JSONRootableType } from "./JSONType.ts"
import type { Type } from "./Type.ts"
import { TypeVisitor } from "./TypeVisitor.ts"

export type AssertDiagnostics = Array<Diagnostic>
export interface Diagnostic {
  path: AssertPath
  error: Error
}
export type AssertPath = Array<PathKey>
export type PathKey = number | string

export function AssertDiagnostics<T extends JSONValue, J extends JSONRootableType>(
  type: Type<T, J>,
  value: JSONValue,
): Array<Diagnostic> {
  const state = new AssertDiagnosticsState()
  visit(undefined, type)(value, state)
  return state.diagnostics
}

class AssertDiagnosticsState {
  constructor(
    readonly diagnostics: Array<Diagnostic> = [],
    readonly path: Array<number | string> = [],
  ) {}

  new(key?: PathKey) {
    return new AssertDiagnosticsState(this.diagnostics, [...this.path, ...key !== undefined ? [key] : []])
  }
}

const visit = TypeVisitor<undefined, (value: JSONValue, vState: AssertDiagnosticsState) => void>({
  null() {
    return (value) => {
      assert(value === null)
    }
  },
  boolean() {
    return (value) => {
      assert(typeof value === "boolean")
    }
  },
  integer() {
    return (value) => {
      assert(typeof value === "number" && Number.isInteger(value))
    }
  },
  number() {
    return (value) => {
      assert(typeof value === "number")
    }
  },
  string() {
    return (value) => {
      assert(typeof value === "string")
    }
  },
  const(_state, _type, _valueType, value_) {
    return (value) => {
      assertJSONValueEquals(value_, value)
    }
  },
  array(tState, _type, element) {
    const visitElement = visit(tState, element)
    return (value, vState) => {
      assert(Array.isArray(value))
      value.forEach((e, i) => visitElement(e, vState.new(i)))
    }
  },
  enum(_tState, _type, ...values) {
    return (value) => {
      assert(typeof value == "string")
      assert(values.includes(value))
    }
  },
  union(tState, _type, ...members) {
    return (value, vState) => {
      assert(members.some((member) => {
        const memberState = vState.new()
        visit(tState, member)(value, memberState)
        return !memberState.diagnostics.length
      }))
    }
  },
  // TODO: clean up
  _object(tState, _type, fields) {
    return (value, vState) => {
      assert(typeof value === "object" && value !== null)
      if (Array.isArray(fields)) {
        ;(fields as _TupleFields).forEach((fieldType, i) => {
          assert(i in value)
          const childValue = value[i]
          assert(childValue !== undefined)
          visit(tState, fieldType)(childValue, vState.new(i))
        })
      } else {
        Object.entries(fields).forEach(([k, v]) => {
          assert(k in value)
          const childValue = value[k as never]
          assert(childValue !== undefined)
          visit(tState, v)(childValue, vState.new(k))
        })
      }
    }
  },
  ref(tState, _type, getType) {
    return (value, vState) => {
      visit(tState, getType())(value, vState)
    }
  },
})
