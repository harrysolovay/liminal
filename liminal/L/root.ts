import * as Effect from "effect/Effect"
import { flow } from "effect/Function"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import type { LEvent } from "../LEvent.ts"
import { Thread, ThreadState } from "../Thread.ts"
import type { Sequencer } from "../util/Sequencer.ts"
import { Self } from "./Self.ts"
import { sequence } from "./sequence.ts"

/** Run the effect (or sequence) with a new thread. */
export const root: Sequencer<Thread> = flow(
  sequence,
  Effect.provideServiceEffect(
    Self,
    Effect.gen(function*() {
      return Thread({
        parent: yield* Effect.serviceOption(Self),
        events: yield* PubSub.unbounded<LEvent>(),
        state: ThreadState.default(),
        tools: Option.none(),
      })
    }),
  ),
)
