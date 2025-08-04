import type { Effect } from "effect/Effect"

export type Sequence<I = never, O = never> = <Arg extends Array<Effect<any, any, any>>>(
  ...steps: Arg
) => Effect<
  Arg extends [] ? void : Arg extends [...infer _0, infer L extends Effect<any, any, any>] ? Effect.Success<L> : never,
  Effect.Error<Arg[number]>,
  Exclude<Effect.Context<Arg[number]>, I> | O
>
