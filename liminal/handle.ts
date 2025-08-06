import * as Effect from "effect/Effect"
import type { RuntimeFiber } from "effect/Fiber"
import * as Scope from "effect/Scope"
import * as Stream from "effect/Stream"
import type { LEvent } from "./LEvent.ts"
import { Strand } from "./Strand.ts"

/** Attach an event handler to process the events of the current strand. */
export const handle: <A, E, R>(
  f: (event: LEvent) => Effect.Effect<A, E, R>,
) => Effect.Effect<RuntimeFiber<void, E>, never, Strand | R | Scope.Scope> = Effect.fnUntraced(function*(f) {
  const latch = yield* Effect.makeLatch(false)
  const { events } = yield* Strand
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
