import { infer } from "../L.ts"
import { LiminalAssertionError } from "../LiminalAssertionError.ts"
import type { Falsy } from "../util/Falsy"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray"
import { unimplemented } from "../util/unimplemented.ts"
import { AssertDiagnostics } from "./AssertDiagnostics.ts"
import { toJSON } from "./toJSON.ts"
import { type Type, TypeKey, type TypeMembers } from "./Type"

export function declareType<X extends Type>(
  declaration: () => X | ((...args: any) => X),
  args?: Array<unknown>,
  descriptions: Array<string> = [],
): X {
  return Object.assign(
    Type,
    {
      [TypeKey]: true,
      declaration,
      args,
      descriptions,
      "~standard": {
        vendor: "liminal",
        version: 1,
        validate(_value) {
          unimplemented()
        },
      },
      toJSON,
      assert(value) {
        const diagnostics = AssertDiagnostics(this as never, value)
        if (diagnostics.length) {
          // TODO: better formatting of diagnostics
          throw new LiminalAssertionError(
            diagnostics.map(({ path, error }) => `path ${path}: ${JSON.stringify(error)}`).join("\n"),
          )
        }
        return value as X["T"]
      },
      *[Symbol.iterator]() {
        return yield* infer(this)
      },
    } satisfies TypeMembers<X["T"], X["J"]>,
  ) as never

  function Type(template: TemplateStringsArray, ...substitutions: Array<string>): X
  function Type(...values: Array<Falsy | string>): X
  function Type(e0: TemplateStringsArray | Falsy | string, ...eRest: Array<Falsy | string>): X {
    return declareType(declaration, args, [
      ...descriptions,
      // TODO: utilize cole's fixTemplateStrings utility.
      ...isTemplateStringsArray(e0) ? [String.raw(e0, eRest)] : [e0, ...eRest].filter((v): v is string => !!v),
    ])
  }
}
