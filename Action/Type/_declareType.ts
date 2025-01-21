import type { Falsy } from "../../util/Falsy.ts"
import { isTemplateStringsArray } from "../../util/isTemplateStringsArray.ts"
import type { TypeMembers } from "./_TypeMembers.ts"
import type { Type } from "./Type.ts"

export function declareType<T>(
  self: () => Type<T> | ((...args: any) => Type<T>),
  args?: Array<unknown>,
  descriptions: Array<string> = [],
): Type<T> {
  return Object.assign(
    annotate,
    {
      kind: "Type",
      self,
      args,
      descriptions,
      *[Symbol.iterator]() {
        return yield this as never
      },
    } satisfies TypeMembers<T>,
  ) as never

  function annotate(
    template: TemplateStringsArray,
    ...substitutions: Array<string>
  ): Type<T>
  function annotate(...values: Array<Falsy | string>): Type<T>
  function annotate(
    e0: TemplateStringsArray | Falsy | string,
    ...rest: Array<Falsy | string>
  ): Type<T> {
    return declareType(self, args, [
      ...descriptions,
      ...isTemplateStringsArray(e0)
        ? [String.raw(e0, ...rest)]
        : [e0, ...rest].filter((v): v is string => !!v),
    ])
  }
}
