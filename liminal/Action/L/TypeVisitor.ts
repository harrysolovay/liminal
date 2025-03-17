import { type Intrinsics, getIntrinsicLookup } from "./intrinsics/Intrinsics.js"
import type { L } from "./L.js"

export type VisitorArms<S, R> = {
  hook?: (next: (state: S, type: L) => R, state: S, type: L) => R
} & (
  | ({ fallback?: never } & IntrinsicVisitorArms<S, R>)
  | ({ fallback: (state: S, type: L, ...args: Array<unknown>) => R } & Partial<IntrinsicVisitorArms<S, R>>)
)

export type IntrinsicVisitorArms<S, R> = {
  [K in keyof Intrinsics]: (
    state: S,
    ...args: Intrinsics[K] extends L
      ? [Intrinsics[K]]
      : Intrinsics[K] extends (...args: infer A) => infer T
        ? [T, ...A]
        : never
  ) => R
}

export function TypeVisitor<S, R>(arms: VisitorArms<S, R>): (state: S, type: L) => R {
  const { hook } = arms
  if (hook) {
    return (state, type) => hook(next, state, type)
  }

  return next

  function next(state: S, type: L): R {
    return ((arms[getIntrinsicLookup().get(type.self())!] as any) ?? arms.fallback)!(state, type, ...(type.args ?? []))
  }
}
