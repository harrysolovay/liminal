import type { StandardSchemaV1 } from "@standard-schema/spec"
import { infer } from "../actions/Infer.ts"
import { LiminalAssertionError } from "../LiminalAssertionError.ts"
import type { Falsy } from "../util/Falsy.ts"
import { applyTemplateWithIndentation } from "../util/fixTemplateStrings.ts"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import { AssertDiagnostics, formatAssertDiagnostics } from "./AssertDiagnostics.ts"
import { toJSON } from "./toJSON.ts"
import { type Type, TypeKey, type TypeMembers } from "./Type.ts"

export function declareType<X extends Type>(
  declaration: () => X | ((...args: any) => X),
  args?: Array<unknown>,
  descriptions: Array<string> = [],
): X {
  const type = Object.assign(
    Type,
    {
      [TypeKey]: true,
      declaration,
      args,
      descriptions,
      description() {
        return descriptions.join("\n")
      },
      "~standard": {
        vendor: "liminal",
        version: 1,
        validate: (value) => {
          const diagnostics = AssertDiagnostics(type as never, value)
          if (diagnostics.length) {
            return {
              issues: diagnostics.map(({ path, error }): StandardSchemaV1.Issue => ({
                path,
                message: JSON.stringify(error),
              })),
            }
          }
          return { value: value as X["T"] }
        },
      },
      toJSON,
      assert: (value) => {
        const diagnostics = AssertDiagnostics(type as never, value)
        if (diagnostics.length) {
          throw new LiminalAssertionError(formatAssertDiagnostics(diagnostics))
        }
        return value as never
      },
      ...{
        *[Symbol.iterator]() {
          return yield* infer(this)
        },
      },
    } satisfies TypeMembers<X["T"], X["J"]>,
  ) as never as X
  return type

  function Type(template: TemplateStringsArray, ...substitutions: Array<string>): X
  function Type(...values: Array<Falsy | string>): X
  function Type(e0: TemplateStringsArray | Falsy | string, ...eRest: Array<Falsy | string>): X {
    return declareType(declaration, args, [
      ...descriptions,
      ...isTemplateStringsArray(e0)
        ? [applyTemplateWithIndentation(e0, ...eRest)]
        : [e0, ...eRest].filter((v): v is string => !!v),
    ])
  }
}
