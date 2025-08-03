import * as Effect from "effect/Effect"
import * as Stream from "effect/Stream"
import { Strand } from "./Conversation.ts"
import type { LEvent } from "./LEvent"

/** Get a new event stream of the events of the current strand. */
export const events: Stream.Stream<LEvent, never, Strand> = Stream.unwrap(
  Effect.map(Strand, ({ events }) => Stream.fromPubSub(events)),
)
