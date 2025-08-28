import * as Effect from "effect/Effect"
import * as FiberSet from "effect/FiberSet"
import * as Scope from "effect/Scope"
import type { Thread } from "../Thread.ts"
import { self } from "./self.ts"

export const scoped = <E, R>(
  make: Effect.Effect<Thread, E, R>,
) =>
  Effect.fnUntraced(function*<A1, E1, R1>(x: Effect.Effect<A1, E1, R1>) {
    const scope = yield* Scope.make()
    const provideScope = Effect.provideService(Scope.Scope, scope)
    const thread = yield* make.pipe(provideScope)
    const result = yield* x.pipe(
      Effect.provideService(self, thread),
      provideScope,
    )
    yield* FiberSet.join(thread.daemons)
    return result
  })
