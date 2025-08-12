import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import type { LEvent } from "./LEvent.ts"
import { Thread, ThreadState, threadTag } from "./Thread.ts"

export const thread: Effect.Effect<Thread> = Effect.gen(function*() {
  return Thread({
    parent: yield* Effect.serviceOption(threadTag),
    events: yield* PubSub.unbounded<LEvent>(),
    state: ThreadState.default(),
    tools: Option.none(),
  })
})
