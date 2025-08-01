import * as Effect from "effect/Effect"
import * as Pipeable from "effect/Pipeable"
import * as Yield from "./_Yield.ts"
import { type Reducer, ReducerTypeId } from "./Reducer.ts"

export const reduce: <Y extends Yield.Any, E1, R1>(
  f: () => Generator<Y, Effect.Effect<void, E1, R1>, never>,
) => Reducer<Yield.E<Y>, Yield.R<Y>, E1, R1> = (f) => ({
  [ReducerTypeId]: {
    _E: (_: never) => _,
    _R: (_: never) => _,
    _E1: (_: never) => _,
    _R1: (_: never) => _,
  },
  effect: Effect.gen(f),
  pipe() {
    return Pipeable.pipeArguments(this, arguments)
  },
})
