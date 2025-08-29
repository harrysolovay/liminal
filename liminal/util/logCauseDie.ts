import * as Console from "effect/Console"
import * as Effect from "effect/Effect"

export const logCauseDie = <A, E, R>(x: Effect.Effect<A, E, R>): Effect.Effect<A, never, R> =>
  Effect.catchAllCause(x, (cause) =>
    Console.log(cause).pipe(
      Effect.andThen(Effect.die),
    ))
