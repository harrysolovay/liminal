import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import type * as Fiber from "effect/Fiber"
import * as Scope from "effect/Scope"
import * as Stream from "effect/Stream"
import type { LEvent } from "../LEvent.ts"
import type { Thread } from "../Thread.ts"
import { self } from "./self.ts"

/** Attach an event handler to process thread events. */
export const listen: <E, R>(
  f: (event: LEvent) => Effect.Effect<void, E, R>,
) => Effect.Effect<Fiber.RuntimeFiber<void, E>, never, Thread | Scope.Scope | R> = Effect.fnUntraced(function*<E, R>(
  f: (event: LEvent) => Effect.Effect<void, E, R>,
) {
  const thread = yield* self

  const latch = yield* Effect.makeLatch(false)

  const provided = yield* Scope.Scope
  const closeable = yield* Scope.make()
  const close = Scope.close(closeable, Exit.void)
  yield* Scope.addFinalizer(thread.scope, close)
  yield* Scope.addFinalizer(provided, close)

  const dequeue = yield* thread.events.subscribe.pipe(
    Effect.provideService(Scope.Scope, closeable),
  )
  const fiber = yield* Stream.fromQueue(dequeue).pipe(
    Stream.runForEach((v) =>
      f(v).pipe(
        Effect.forkDaemon,
      )
    ),
    Effect.fork,
  )
  yield* latch.open
  return fiber
})
