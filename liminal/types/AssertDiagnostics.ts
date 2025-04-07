import { assert } from "../util/assert.ts"
import { isJSONValue } from "../util/isJSONValue.ts"
import { jsonEquals } from "../util/jsonEquals.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { JSONValue } from "../util/JSONValue.ts"
import type { JSONType } from "./JSONType.ts"
import type { Type } from "./Type.ts"
import { TypeVisitor } from "./TypeVisitor.ts"

export type AssertDiagnostics = Array<Diagnostic>
export class Diagnostic {
  constructor(
    readonly path: AssertPath,
    readonly type: Type,
    readonly error: unknown,
  ) {}

  message() {
    return this.error instanceof Error ? this.error.message : JSON.stringify(this.error)
  }

  formatPath() {
    let formatted = ""
    for (let i = 0; i < this.path.length; i++) {
      const key = this.path[i]!
      if (typeof key === "string") {
        try {
          const int = parseInt(key)
          if (Number.isInteger(int)) {
            formatted += `[${int}]`
          } else {
            formatted += `.${key}`
          }
        } catch (_e: unknown) {
          formatted += `.${key}`
        }
      } else {
        formatted += `[${key}]`
      }
    }
    return formatted
  }
}
export type AssertPath = Array<JSONKey>

// Possibly: `nullUnionFieldsAsOptional?: boolean`
export interface AssertDiagnosticsConfig {}

export function AssertDiagnostics<T extends JSONValue, J extends JSONType>(
  config: AssertDiagnosticsConfig,
  type: Type<T, J>,
  value: unknown,
): Array<Diagnostic> {
  const state = new ValueVisitorState()
  visit([config, false], type)(value, state)
  return state.diagnostics
}

class ValueVisitorState {
  constructor(
    readonly diagnostics: Array<Diagnostic> = [],
    readonly path: Array<number | string> = [],
  ) {}

  new(key?: JSONKey) {
    return new ValueVisitorState(this.diagnostics, [...this.path, ...key !== undefined ? [key] : []])
  }
}

const visit: TypeVisitor<AssertDiagnosticsConfig, (value: unknown, vState: ValueVisitorState) => void> = TypeVisitor(
  {
    hook(next, tState, type) {
      return (value, vState) => {
        try {
          next(tState, type)(value, vState)
        } catch (error) {
          vState.diagnostics.push(new Diagnostic(vState.path, type, error))
        }
      }
    },
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
        assert(isJSONValue(value) && jsonEquals(value_, value))
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
    _union(tState, _type, ...members) {
      return (value, vState) => {
        assert(members.some((member) => {
          const memberState = vState.new()
          visit(tState, member)(value, memberState)
          return !memberState.diagnostics.length
        }))
      }
    },
    _object(tState, _type, fields) {
      return (value, vState) => {
        assert(typeof value === "object" && value !== null)
        if (Array.isArray(fields)) {
          fields.forEach((v, i) => {
            visitField(tState, vState, value, i, v)
          })
        } else {
          Object.entries(fields).forEach(([k, v]) => {
            visitField(tState, vState, value, k, v)
          })
        }
      }
    },
    ref(tState, _type, getType) {
      return (value, vState) => {
        visit(tState, getType())(value, vState)
      }
    },
  },
)

function visitField(
  tState: AssertDiagnosticsConfig,
  vState: ValueVisitorState,
  value: object,
  key: JSONKey,
  type: Type,
) {
  assert(key in value)
  const childValue = value[key as never]
  assert(childValue !== undefined)
  visit(tState, type)(childValue, vState.new(key))
}

// TODO: serialize signature
export function formatAssertDiagnostics(diagnostics: AssertDiagnostics) {
  return diagnostics
    .map((diagnostic) => `Error "${diagnostic.message()}"; encountered at ${diagnostic.formatPath()}`)
    .join("\n")
}
