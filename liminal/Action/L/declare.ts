import type { Falsy } from "../../util/Falsy.js"
import { isTemplateStringsArray } from "../../util/isTemplateStringsArray.js"
import type { LMembers } from "./LMembers.js"
import { LTag } from "./isL.js"
import type { L } from "./L.js"
import { toJSONSchema } from "./toJSONSchema.js"

export function declare<I, O>(
  self: () => L<I, O> | ((...args: any) => L<I, O>),
  args?: Array<unknown>,
  descriptions: Array<string> = [],
): L<I, O> {
  return Object.assign(annotate, {
    [LTag]: true,
    self,
    args,
    descriptions,
    toJSONSchema,
    *[Symbol.iterator]() {
      return yield {
        kind: "Complete",
        type: this as L<I, O>,
      }
    },
    "~standard": {
      version: 1,
      vendor: "liminal",
      // TODO
      validate: (value) => ({ value: value as O }),
    },
  } satisfies LMembers<I, O>) as never

  function annotate(template: TemplateStringsArray, ...substitutions: Array<string>): L<I, O>
  function annotate(...values: Array<Falsy | string>): L<I, O>
  function annotate(e0: TemplateStringsArray | Falsy | string, ...rest: Array<Falsy | string>): L<I, O> {
    return declare(self, args, [
      ...descriptions,
      ...(isTemplateStringsArray(e0) ? [String.raw(e0, ...rest)] : [e0, ...rest].filter((v): v is string => !!v)),
    ])
  }
}
