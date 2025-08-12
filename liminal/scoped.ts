import * as Effect from "effect/Effect"
import { flow } from "effect/Function"
import { sequence } from "./sequence.ts"
import { Thread } from "./ThreadInitial.ts"
import { type Sequencer } from "./util/Sequencer.ts"

/** Isolate the effect with a new strand in context. */
export const scoped: Sequencer<Thread> = flow(
  sequence,
  Effect.provide(Thread.layer()),
)
