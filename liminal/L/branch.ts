import * as Effect from "effect/Effect"
import { flow } from "effect/Function"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import type { LEvent } from "../LEvent.ts"
import { Thread, ThreadState } from "../Thread.ts"
import type { Sequencer } from "../util/Sequencer.ts"
import { self } from "./self.ts"
import { sequence } from "./sequence.ts"

export interface branch extends Sequencer<never, never, Thread>, Effect.Effect<Thread, never, Thread> {}

const branch_ = Effect.gen(function*() {
  const parent = yield* self
  return Thread({
    id: parent.id,
    parent: Option.some(parent),
    events: yield* PubSub.unbounded<LEvent>(),
    state: ThreadState.make({
      system: parent.state.system,
      messages: [...parent.state.messages ?? []],
    }),
    tools: parent.tools.pipe(Option.map((v) => new Set(v))),
  })
})

export const branch: branch = Object.assign(
  flow(
    sequence,
    Effect.provideServiceEffect(self, branch_),
  ),
  branch_,
)
