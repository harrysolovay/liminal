import * as Effect from "effect/Effect"
import { flow } from "effect/Function"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import type { LEvent } from "../LEvent.ts"
import { Thread, ThreadState } from "../Thread.ts"
import type { Sequencer } from "../util/Sequencer.ts"
import { Self } from "./Self.ts"
import { sequence } from "./sequence.ts"

export interface thread extends Sequencer<Thread>, Effect.Effect<Thread> {}

const make = Effect.gen(function*() {
  return Thread({
    parent: yield* Effect.serviceOption(Self),
    events: yield* PubSub.unbounded<LEvent>(),
    state: ThreadState.default(),
    tools: Option.none(),
  })
})

export const thread: thread = Object.assign(
  flow(
    sequence,
    Effect.provideServiceEffect(Self, make),
  ),
  make,
)
