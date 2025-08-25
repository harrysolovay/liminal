import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import type { LEvent } from "../LEvent.ts"
import { Thread, ThreadId, ThreadState } from "../Thread.ts"
import { self } from "./self.ts"

export const thread: Effect.Effect<Thread> = Effect.gen(function*() {
  return Thread({
    id: ThreadId.make(crypto.randomUUID()),
    parent: yield* Effect.serviceOption(self),
    events: yield* PubSub.unbounded<LEvent>(),
    state: ThreadState.default(),
    tools: Option.none(),
  })
})
