import * as Effect from "effect/Effect"
import { flow, identity } from "effect/Function"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import type { LEvent } from "./LEvent.ts"
import { sequence } from "./sequence.ts"
import { Thread } from "./ThreadInitial.ts"
import type { Sequencer } from "./util/Sequencer.ts"

/** Isolate the effect with a new strand in context. */
export const branched: Sequencer<never, Thread> = flow(
  sequence,
  Effect.provideServiceEffect(
    Thread,
    Effect.gen(function*() {
      const parent = yield* Thread
      // TODO
      return Thread.of(Object.assign({
        id: parent.id,
        parent: Option.some(parent),
        system: Option.map(parent.system, identity),
        events: yield* PubSub.unbounded<LEvent>(),
        messages: parent.messages.slice(),
        tools: new Set(parent.tools),
      }))
    }),
  ),
)
