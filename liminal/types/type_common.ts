import { nullaryMemo } from "../util/nullaryMemo.ts"
import * as I from "./intrinsics.ts"
import type { Type } from "./Type.ts"

export type IntrinsicTypes = typeof I
export type IntrinsicTypeName = keyof IntrinsicTypes
export type IntrinsicType = IntrinsicTypes[IntrinsicTypeName]

export const getIntrinsicNameLookup = nullaryMemo(() =>
  new Map(Object.entries(I).map((entry) => entry.reverse() as [IntrinsicType, keyof IntrinsicTypes]))
)

export function typeName(type: Type): IntrinsicTypeName {
  return getIntrinsicNameLookup().get(type.declaration() as IntrinsicType)!
}

export const PARENT_TYPE_NAMES: { [K in IntrinsicTypeName]?: true } = {
  _object: true,
  _array: true,
  _union: true,
}
