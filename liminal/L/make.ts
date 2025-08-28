import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as Scope from "effect/Scope"
import type { Thread } from "../Thread.ts"
import { self } from "./self.ts"

export const make = <E, R>(
  make: Effect.Effect<Thread, E, R>,
) =>
  Effect.fnUntraced(function*<A1, E1, R1>(x: Effect.Effect<A1, E1, R1>) {
    const thread = yield* make
    const result = yield* x.pipe(
      Effect.provideService(self, thread),
    )
    yield* Scope.close(thread.scope, Exit.void)
    return result
  })
