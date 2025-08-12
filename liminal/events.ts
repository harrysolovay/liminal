import * as Effect from "effect/Effect"
import * as Stream from "effect/Stream"
import type { LEvent } from "./LEvent.ts"
import { Self } from "./Self.ts"
import type { Thread } from "./Thread.ts"

/** A stream of events from the current strand. */
export const events: Stream.Stream<LEvent, never, Thread> = Self.pipe(
  Effect.map(({ events }) => Stream.fromPubSub(events)),
  Stream.unwrap,
)
