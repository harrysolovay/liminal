import * as Effect from "effect/Effect"

export const extractRow0 = <A, E, R>(
  rows: Effect.Effect<Array<A>, E, R>,
): Effect.Effect<A | undefined, E, R> => rows.pipe(Effect.map(([v]) => v))

export const extractRow0OrDie = <A, E, R>(
  rows: Effect.Effect<Array<A>, E, R>,
): Effect.Effect<A, E, R> =>
  extractRow0(rows).pipe(
    Effect.flatMap(Effect.fromNullable),
    Effect.catchTag("NoSuchElementException", Effect.die),
  )
