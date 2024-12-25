import type { Expand } from "../util/mod.ts"
import type * as I from "./intrinsics.ts"
import type { AnyType } from "./Type.ts"

type I = typeof I

export type TypeVisitorArms<C, R> = Expand<
  & {
    hook?: (
      next: (ctx: C, type: AnyType) => R,
      ctx: C,
      type: AnyType,
    ) => R
  }
  & (
    | ({ fallback?: never } & TypeVisitorIntrinsicArms<C, R>)
    | (
      & { fallback: (ctx: C, type: AnyType, ...args: Array<unknown>) => R }
      & Partial<TypeVisitorIntrinsicArms<C, R>>
    )
  )
>

export type TypeVisitorIntrinsicArms<C, R> = {
  [K in keyof I]: (
    ctx: C,
    ...rest: I[K] extends AnyType ? [type: I[K]]
      : [type: ReturnType<I[K]>, ...args: Parameters<I[K]>]
  ) => R
}

export function TypeVisitor<C, R>(arms: TypeVisitorArms<C, R>): (ctx: C, type: AnyType) => R {
  const { hook } = arms
  if (hook) {
    return (ctx, type) => hook(next, ctx, type)
  }
  return next

  function next(ctx: C, type: AnyType): R {
    return (arms[type.type as keyof I] ?? arms.fallback!)(
      ctx,
      type as never,
      ...(type.args ?? []) as Array<never>,
    )
  }
}
