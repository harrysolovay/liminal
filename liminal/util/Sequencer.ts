import type * as Effect from "effect/Effect"

export interface Sequencer<Provides = never, Requires = never> {
  <Arg extends Array<Effect.All.EffectAny>>(
    ...steps: Arg
  ): Effect.Effect<
    Arg extends [] ? void
      : Arg extends [...infer _0, infer L extends Effect.All.EffectAny] ? Effect.Effect.Success<L>
      : never,
    Effect.Effect.Error<Arg[number]>,
    Exclude<Effect.Effect.Context<Arg[number]>, Provides> | Requires
  >
}
