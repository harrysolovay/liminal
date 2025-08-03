import * as Effect from "effect/Effect"

export type Sequence<P = never, R1 = never> = <Arg extends Array<Effect.Effect<any, any, any>>>(
  ...steps: Arg
) => Effect.Effect<
  Arg extends [] ? void
    : [Arg extends [...infer _0, infer L] ? L : never] extends [Effect.Effect<infer A, infer _E, infer _R>] ? A
    : never,
  Arg[number] extends never ? never : [Arg[number]] extends [Effect.Effect<infer _A, infer E, infer _R>] ? E : never,
  Exclude<
    Arg[number] extends never ? never : [Arg[number]] extends [Effect.Effect<infer _A, infer _E, infer R>] ? R : never,
    P
  > | R1
>

// TODO: maybe ditch `Effect.all`?
export const ab: Sequence = (...steps) =>
  Effect.all(steps, {
    concurrency: 1,
  }).pipe(
    Effect.map((v: Array<never>) => v.pop()!) as never,
  )
