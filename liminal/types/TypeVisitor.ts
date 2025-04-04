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

// TODO: better name?
export function isParentType(type: Type): boolean {
  return ["_object", "array", "union"].includes(getTypeName(type))
}

export type VisitorArms<S, R> =
  & {
    hook?: (
      next: (state: S, type: Type) => R,
      state: S,
      type: Type,
    ) => R
  }
  & (
    | (
      & IntrinsicVisitorArms<S, R>
      & { fallback?: never }
    )
    | (
      & Partial<IntrinsicVisitorArms<S, R>>
      & { fallback: () => R }
    )
  )

export type IntrinsicVisitorArms<S, R> = {
  [K in keyof IntrinsicTypes]: (
    state: S,
    ...args: IntrinsicTypes[K] extends Type ? [IntrinsicTypes[K]]
      : IntrinsicTypes[K] extends (...args: infer A) => infer T ? [T, ...A]
      : never
  ) => R
}

export function TypeVisitor<S, R>(arms: VisitorArms<S, R>): (state: S, type: Type) => R {
  const { hook } = arms
  if (hook) {
    return (state, type) => hook(next, state, type)
  }

  return next

  function next(state: S, type: Type): R {
    return (arms[getTypeName(type)] as any ?? arms.fallback)(
      state,
      type,
      ...(type.args ?? []),
    )
  }
}
