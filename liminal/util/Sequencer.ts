import type * as Effect from "effect/Effect"

export interface Sequencer<RIn = never, E = never, ROut = never> {
  <Arg extends Array<Effect.All.EffectAny>>(
    ...steps: Arg
  ): Effect.Effect<
    Arg extends [] ? void
      : Arg extends [...infer _0, infer L extends Effect.All.EffectAny] ? Effect.Effect.Success<L>
      : never,
    Effect.Effect.Error<Arg[number]> | E,
    Exclude<Effect.Effect.Context<Arg[number]>, RIn> | ROut
  >
}
