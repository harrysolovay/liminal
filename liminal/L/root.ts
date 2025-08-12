import * as Effect from "effect/Effect"
import { flow } from "effect/Function"
import { Thread } from "../Thread.ts"
import type { Sequencer } from "../util/Sequencer.ts"
import { Self } from "./Self.ts"
import { sequence } from "./sequence.ts"
import { thread } from "./thread.ts"

/** Run the effect (or sequence) with a new thread. */
export const root: Sequencer<Thread> = flow(
  sequence,
  Effect.provideServiceEffect(Self, thread),
)
