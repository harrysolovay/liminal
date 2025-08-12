import * as Effect from "effect/Effect"
import { flow } from "effect/Function"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import type { LEvent } from "./LEvent.ts"
import { sequence } from "./sequence.ts"
import { Thread, ThreadState, threadTag } from "./Thread.ts"
import type { Sequencer } from "./util/Sequencer.ts"

/** Isolate the effect with a new strand in context. */
export const branch: Sequencer<never, Thread> = flow(
  sequence,
  Effect.provideServiceEffect(
    threadTag,
    Effect.gen(function*() {
      const parent = yield* threadTag
      return Thread({
        parent: Option.some(parent),
        events: yield* PubSub.unbounded<LEvent>(),
        state: ThreadState.make({
          fqn: parent.state.fqn,
          system: parent.state.system,
          messages: [...parent.state.messages ?? []],
        }),
        tools: parent.tools.pipe(Option.map((v) => new Set(v))),
      })
    }),
  ),
)
