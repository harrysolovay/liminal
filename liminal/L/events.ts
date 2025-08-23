import * as Effect from "effect/Effect"
import * as Stream from "effect/Stream"
import type { LEvent } from "../LEvent.ts"
import type { Thread } from "../Thread.ts"
import { self } from "./self.ts"

/** A stream of thread events. */
export const events: Stream.Stream<LEvent, never, Thread> = self.pipe(
  Effect.map(({ events }) => Stream.fromPubSub(events)),
  Stream.unwrap,
)
