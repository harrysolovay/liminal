import { nullaryMemo } from "../util/nullaryMemo.ts"
import * as I from "./intrinsics"
import type { Type } from "./Type.ts"

export type IntrinsicTypes = typeof I
export type IntrinsicTypeName = keyof IntrinsicTypes
export type IntrinsicType = IntrinsicTypes[IntrinsicTypeName]

export const getIntrinsicNameLookup = nullaryMemo(() =>
  new Map(Object.entries(I).map((entry) => entry.reverse() as [IntrinsicType, keyof IntrinsicTypes]))
)

export function getTypeName(type: Type): IntrinsicTypeName {
  return getIntrinsicNameLookup().get(type.declaration() as IntrinsicType)!
}

export function isParentType(type: Type): boolean {
  return ["_object", "array", "union"].includes(getTypeName(type))
}
