import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import type { LEvent } from "../LEvent.ts"
import { Thread, ThreadId, ThreadState } from "../Thread.ts"
import { ThreadFactory } from "../ThreadFactory.ts"
import type { Sequencer } from "../util/Sequencer.ts"
import { self } from "./self.ts"

export interface thread extends Sequencer<Thread>, Effect.Effect<Thread> {}

export const thread: thread = ThreadFactory(
  Effect.gen(function*() {
    return Thread({
      id: ThreadId.make(crypto.randomUUID()),
      parent: yield* Effect.serviceOption(self),
      events: yield* PubSub.unbounded<LEvent>(),
      state: ThreadState.default(),
      tools: Option.none(),
    })
  }),
)
