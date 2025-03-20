import { type Intrinsics, getIntrinsicLookup } from "./intrinsics/Intrinsics.js"
import type { Type } from "./Type.js"

export type VisitorArms<S, R> = {
  hook?: (next: (state: S, type: Type) => R, state: S, type: Type) => R
} & (
  | ({ fallback?: never } & IntrinsicVisitorArms<S, R>)
  | ({ fallback: (state: S, type: Type, ...args: Array<unknown>) => R } & Partial<IntrinsicVisitorArms<S, R>>)
)

export type IntrinsicVisitorArms<S, R> = {
  [K in keyof Intrinsics]: (
    state: S,
    ...args: Intrinsics[K] extends Type
      ? [Intrinsics[K]]
      : Intrinsics[K] extends (...args: infer A) => infer T
        ? [T, ...A]
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
    return ((arms[getIntrinsicLookup().get(type.self())!] as any) ?? arms.fallback)!(state, type, ...(type.args ?? []))
  }
}
