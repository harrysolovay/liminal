import type { Falsy } from "@std/assert"
import type { Expand } from "../../util/mod.ts"
import * as I from "../intrinsics.ts"
import type { AnyType, Type } from "../Type.ts"

export function TaggedUnion<M extends Record<string, Falsy | AnyType>>(members: M): Type<
  {
    [K in keyof M]: Expand<
      & { type: K }
      & (M[K] extends AnyType ? { value: M[K]["T"] } : { value?: never })
    >
  }[keyof M],
  Extract<M[keyof M], AnyType>["D"]
> {
  return I.union(
    ...Object.keys(members).toSorted().map((tag) =>
      I.object({
        type: I.const(I.string, tag),
        value: members[tag] ? members[tag] : I.null,
      } as never)
    ),
  )
}
