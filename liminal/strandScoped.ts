import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as Scope from "effect/Scope"
import { Strand } from "./Strand.ts"

export const strandScoped: <A, E, R>(
  effect: Effect.Effect<A, E, R>,
) => Effect.Effect<A, E, R | Strand> = Effect.fnUntraced(function*(effect) {
  const { scope } = yield* Strand
  const exit = yield* Effect.exit(effect)
  yield* Scope.close(scope, exit)
  if (Exit.isFailure(exit)) {
    return yield* Effect.failCause(exit.cause)
  }
  return exit.value
})
