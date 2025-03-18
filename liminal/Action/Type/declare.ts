import type { Falsy } from "../../util/Falsy.js"
import { isTemplateStringsArray } from "../../util/isTemplateStringsArray.js"
import type { TypeMembers } from "./TypeMembers.js"
import { TypeTag } from "./isType.js"
import type { Type } from "./Type.js"
import { toJSONSchema } from "./toJSONSchema.js"

export function declare<I, O>(
  self: () => Type<I, O> | ((...args: any) => Type<I, O>),
  args?: Array<unknown>,
  descriptions: Array<string> = [],
): Type<I, O> {
  return Object.assign(annotate, {
    [TypeTag]: true,
    self,
    args,
    descriptions,
    toJSONSchema,
    *[Symbol.iterator]() {
      return yield {
        kind: "Complete",
        typeLike: this,
      }
    },
    "~standard": {
      version: 1,
      vendor: "liminal",
      // TODO
      validate: (value) => ({ value: value as O }),
    },
    isString: false,
  } satisfies TypeMembers<I, O>) as never

  function annotate(template: TemplateStringsArray, ...substitutions: Array<string>): Type<I, O>
  function annotate(...values: Array<Falsy | string>): Type<I, O>
  function annotate(e0: TemplateStringsArray | Falsy | string, ...rest: Array<Falsy | string>): Type<I, O> {
    return declare(self, args, [
      ...descriptions,
      ...(isTemplateStringsArray(e0) ? [String.raw(e0, ...rest)] : [e0, ...rest].filter((v): v is string => !!v)),
    ])
  }
}
