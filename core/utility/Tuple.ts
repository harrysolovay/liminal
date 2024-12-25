import type { ArrayOfLength } from "../../util/mod.ts"
import * as I from "../intrinsics.ts"
import type { AnyType, Type } from "../Type.ts"

export function Tuple<M extends Array<AnyType>>(
  ...members: M
): Type<{ [I in keyof M]: M[I]["T"] }, M[number]["D"]> {
  return I.transform(
    I.object(Object.fromEntries(members.map((type, i) => [i, type]))),
    (value) => Object.values(value) as never,
  )
}

export namespace Tuple {
  export function N<T, P extends symbol, N extends number>(
    member: Type<T, P>,
    length: N,
  ): Type<ArrayOfLength<T, N>, P> {
    return I.transform(
      I.object(Object.fromEntries(Array.from({ length }, (_0, i) => [i, member]))),
      (value) => Object.values(value) as never,
    )
  }
}
