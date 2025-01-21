import type { Rune, Runic } from "./_Rune.ts"

export type Intrinsics = Record<string, Runic>

export type ExtractRune<I extends Intrinsics> = [
  | Extract<I[keyof I], Rune>
  | ReturnType<Extract<I[keyof I], (...args: any) => Rune>>,
][0]

export type VisitorArms<I extends Intrinsics, S, R> =
  & {
    hook?: (
      next: (state: S, rune: ExtractRune<I>) => R,
      state: S,
      rune: ExtractRune<I>,
    ) => R
  }
  & (
    | ({ fallback?: never } & IntrinsicVisitorArms<I, S, R>)
    | (
      & ({ fallback: (state: S, rune: ExtractRune<I>, ...args: Array<unknown>) => R })
      & Partial<IntrinsicVisitorArms<I, S, R>>
    )
  )

export type IntrinsicVisitorArms<I extends Intrinsics, S, R> = {
  [K in keyof I]: (
    state: S,
    ...rest: I[K] extends Rune ? [rune: I[K]]
      : I[K] extends ((...args: infer A) => infer X) ? [rune: X, ...args: A]
      : never
  ) => R
}

export function Visitor<I extends Intrinsics, S, R>(
  intrinsics: I,
  arms: VisitorArms<I, S, R>,
): (state: S, rune: ExtractRune<I>) => R {
  const lookup = new Map(
    Object
      .entries(intrinsics)
      .map((entry) => entry.reverse() as [Rune | ((...args: any) => Rune), string]),
  )

  const { hook } = arms
  if (hook) {
    return (state, type) => hook(next, state, type)
  }

  return next

  function next(state: S, rune: ExtractRune<I>): R {
    return (arms[lookup.get(rune)!] ?? arms.fallback)!(state, rune, ...rune.args ?? [])
  }
}
