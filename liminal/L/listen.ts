import * as Effect from "effect/Effect"
import type { RuntimeFiber } from "effect/Fiber"
import * as Scope from "effect/Scope"
import * as Stream from "effect/Stream"
import type { LEvent } from "../LEvent.ts"
import type { Thread } from "../Thread.ts"
import { self } from "./self.ts"

/** Attach an event handler to process thread events. */
export const listen: <A, E, R>(
  f: (event: LEvent) => Effect.Effect<A, E, R>,
) => Effect.Effect<RuntimeFiber<void, E>, never, Thread | R | Scope.Scope> = Effect.fnUntraced(function*(f) {
  const latch = yield* Effect.makeLatch(false)
  const { events } = yield* self
  const dequeue = yield* events.subscribe
  const fiber = yield* latch.open.pipe(
    Effect.zipRight(
      Stream.fromQueue(dequeue).pipe(
        Stream.runForEach(f),
        Effect.fork,
      ),
    ),
  )
  yield* latch.await
  return fiber
})
