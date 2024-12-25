import * as I from "../intrinsics.ts"
import type { AnyType, Type } from "../Type.ts"
import { Tuple } from "./Tuple.ts"

export function Flattened<A extends Array<AnyType<Array<unknown>>>>(
  ...sources: A
): Type<NativeFlattened<A>, A[number]["D"]> {
  return I.transform(Tuple(...sources), (value) => value.flat()) as never
}

type NativeFlattened<A extends Array<AnyType<Array<unknown>>>> = A extends
  [infer E0 extends AnyType, ...infer ERest extends Array<AnyType>]
  ? [...E0["T"], ...NativeFlattened<ERest>]
  : []
