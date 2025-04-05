import type { JSONValue } from "../util/JSONValue.ts"
import { AssertDiagnostics } from "./AssertDiagnostics.ts"
import type { Type } from "./Type.ts"

export function match(value: JSONValue, members: Array<Type>): Type | undefined {
  for (const member of members) {
    const diagnostics = AssertDiagnostics(member, value)
    if (!diagnostics.length) {
      return member
    }
  }
  return
}
