import * as Effect from "effect/Effect"
import { prev } from "./prev.ts"

export interface line<RIn = never, E = never, ROut = never> {
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
export const line: line = Effect.fnUntraced(function*(...steps) {
  let acc: unknown
  while (steps.length) {
    const current = steps.shift()!
    acc = yield* (current.pipe(Effect.provideService(prev, acc)) as Effect.Effect<any>)
  }
  return acc as never
})
