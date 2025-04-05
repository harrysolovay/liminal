import type { Type } from "./Type.ts"
import { type IntrinsicTypes, typeName } from "./type_common.ts"

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

export type TypeVisitor<S, R> = (state: S, type: Type) => R

export function TypeVisitor<S, R>(arms: VisitorArms<S, R>): (state: S, type: Type) => R {
  const { hook } = arms
  if (hook) {
    return (state, type) => hook(next, state, type)
  }

  return next

  function next(state: S, type: Type): R {
    return (arms[typeName(type)] as any ?? arms.fallback)(
      state,
      type,
      ...(type.args ?? []),
    )
  }
}
