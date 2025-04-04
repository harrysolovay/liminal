import type { Falsy } from "../util/Falsy"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray"
import { unimplemented } from "../util/unimplemented.ts"
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
