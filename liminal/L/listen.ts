import * as Effect from "effect/Effect"
import { flow } from "effect/Function"
import * as Scope from "effect/Scope"
import * as Stream from "effect/Stream"
import type { LEvent } from "../LEvent.ts"
import type { Thread } from "../Thread.ts"
import { logCauseDie } from "../util/logCauseDie.ts"
import { self } from "./self.ts"

/** Attach an event handler to process thread events. */
export const listen: <E, R>(
  f: (event: LEvent) => Effect.Effect<void, E, R>,
) => Effect.Effect<void, never, Thread | Scope.Scope | R> = Effect.fnUntraced(function*(f) {
  const thread = yield* self

  const latch = yield* Effect.makeLatch(false)

  const dequeue = yield* thread.events.subscribe
  const fiber = yield* Stream.fromQueue(dequeue).pipe(
    Stream.runForEach(flow(
      f,
      logCauseDie,
      Effect.fork,
    )),
    Effect.forkScoped,
    thread.scoped,
  )
  yield* latch.open
  return fiber
})
