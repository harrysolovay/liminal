import * as Effect from "effect/Effect"
import * as Stream from "effect/Stream"
import type { LEvent } from "./LEvent"
import { Strand } from "./Strand.ts"

/** Get a new event stream of the events of the current strand. */
export const events: Stream.Stream<LEvent, never, Strand> = Stream.unwrap(
  Effect.map(Strand, ({ events }) => Stream.fromPubSub(events)),
)
