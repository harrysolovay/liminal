import { assert } from "../util/assert.ts"
import { assertJSONValueEquals } from "../util/assertJSONValueEquals.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { JSONValue } from "../util/JSONValue.ts"
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
  const(_tState, _type, _valueType, value_) {
    return (value) => {
      assertJSONValueEquals(value_, value)
    }
  },
  _array(tState, _type, element) {
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
  _union(_tState, _type, ...members) {
    return (value, vState) => {
      assert(members.some((member) => {
        const memberState = vState.new()
        visit(undefined, member)(value, memberState)
        return !memberState.diagnostics.length
      }))
    }
  },
  _object(_tState, _type, fields) {
    return (value, vState) => {
      assert(typeof value === "object" && value !== null)
      if (Array.isArray(fields)) {
        fields.forEach((v, i) => {
          visitField(vState, value, i, v)
        })
      } else {
        Object.entries(fields).forEach(([k, v]) => {
          visitField(vState, value, k, v)
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

function visitField(
  vState: AssertDiagnosticsState,
  value: object,
  key: JSONKey,
  type: Type,
) {
  assert(key in value)
  const childValue = value[key as never]
  assert(childValue !== undefined)
  visit(undefined, type)(childValue, vState.new(key))
}
