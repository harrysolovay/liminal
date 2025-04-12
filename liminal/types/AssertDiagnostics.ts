import { LiminalAssertionError } from "../LiminalAssertionError.ts"
import { assert } from "../util/assert.ts"
import { isJSONValue } from "../util/isJSONValue.ts"
import { jsonEquals } from "../util/jsonEquals.ts"
import type { JSONKey } from "../util/JSONKey.ts"
import type { JSONValue } from "../util/JSONValue.ts"
import type { JSONType } from "./JSONType.ts"
import type { Type } from "./Type.ts"
import { TypeVisitor } from "./TypeVisitor.ts"

export type AssertDiagnostics = Array<Diagnostic>

export type Diagnostic = ReturnType<typeof Diagnostic>
export function Diagnostic(
  path: AssertPath,
  type: Type,
  value: any,
  error: LiminalAssertionError,
) {
  return {
    path,
    type,
    error,
    value,
    message,
    formatPath,
  }

  function message() {
    return `Error at ${formatPath()}: ${error.message}`
  }

  function formatPath() {
    let formatted = ""
    for (let i = 0; i < path.length; i++) {
      const key = path[i]!
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
  const state = ValueVisitorState()
  visit([config, false], type)(value, state)
  return state.diagnostics
}

type ValueVisitorState = ReturnType<typeof ValueVisitorState>
function ValueVisitorState(
  diagnostics: Array<Diagnostic> = [],
  path: Array<number | string> = [],
) {
  return {
    diagnostics,
    path,
    next,
  }

  function next(key?: JSONKey) {
    return ValueVisitorState(diagnostics, [...path, ...key !== undefined ? [key] : []])
  }
}

const visit: TypeVisitor<AssertDiagnosticsConfig, (value: unknown, vState: ValueVisitorState) => void> = TypeVisitor(
  {
    hook(next, tState, type) {
      return (value, vState) => {
        try {
          next(tState, type)(value, vState)
        } catch (error) {
          if (error instanceof LiminalAssertionError) {
            vState.diagnostics.push(Diagnostic(vState.path, type, value, error))
          } else {
            throw error
          }
        }
      }
    },
    null() {
      return (value) => {
        assert(value === null, `Expected value \`null\`; received \`${JSON.stringify(value)}\`.`)
      }
    },
    boolean() {
      return (value) => {
        assert(typeof value === "boolean", `Expected type \`boolean\`; received \`${JSON.stringify(value)}\`.`)
      }
    },
    integer() {
      return (value) => {
        assert(typeof value === "number", `Expected type \`number\`; received \`${JSON.stringify(value)}\`.`)
        assert(Number.isInteger(value), "Expected number to be an integer.")
      }
    },
    number() {
      return (value) => {
        assert(typeof value === "number", `Expected type \`number\`; received \`${JSON.stringify(value)}\`.`)
      }
    },
    string() {
      return (value) => {
        assert(typeof value === "string", `Expected type \`string\`; received \`${JSON.stringify(value)}\`.`)
      }
    },
    const(_tState, _type, _valueType, value_) {
      return (value) => {
        assert(isJSONValue(value), `Expected valid JSON value; received \`${JSON.stringify(value, null, 2)}\`.`)
        assert(
          jsonEquals(value_, value),
          `Expected value \`${JSON.stringify(value_, null, 2)}\`; received \`${JSON.stringify(value, null, 2)}\``,
        )
      }
    },
    _array(tState, _type, element) {
      const visitElement = visit(tState, element)
      return (value, vState) => {
        assert(Array.isArray(value), `Expected type \`Array\`; received \`${JSON.stringify(value, null, 2)}\`.`)
        value.forEach((e, i) => visitElement(e, vState.next(i)))
      }
    },
    enum(_tState, _type, ...values) {
      return (value) => {
        assert(typeof value == "string", `Expected type \`string\`; received \`${JSON.stringify(value, null, 2)}\`.`)
        assert(values.includes(value), `Expected one of the following values: \`${values.join(`", "`)}\``)
      }
    },
    _union(tState, _type, ...members) {
      return (value, vState) => {
        assert(
          members.some((member) => {
            const memberState = vState.next()
            visit(tState, member)(value, memberState)
            return !memberState.diagnostics.length
          }),
          `Expected value to match one of the union member types; received \`${JSON.stringify(value, null, 2)}\`.`,
        )
      }
    },
    _object(tState, _type, fields) {
      return (value, vState) => {
        assert(
          typeof value === "object" && value !== null,
          `Expected non-null value of type \`object\`; received \`${JSON.stringify(value, null, 2)}\`.`,
        )
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
  visit(tState, type)(childValue, vState.next(key))
}

// TODO: serialize signature
export function formatAssertDiagnostics(diagnostics: AssertDiagnostics) {
  return diagnostics
    .map((diagnostic) => `Error "${diagnostic.message()}"; encountered at ${diagnostic.formatPath()}`)
    .join("\n")
}
