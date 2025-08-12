import * as Effect from "effect/Effect"
import * as Stream from "effect/Stream"
import type { LEvent } from "./LEvent.ts"
import { type Thread, threadTag } from "./Thread.ts"

/** A stream of events from the current strand. */
export const events: Stream.Stream<LEvent, never, Thread> = threadTag.pipe(
  Effect.map(({ events }) => Stream.fromPubSub(events)),
  Stream.unwrap,
)
