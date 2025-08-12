import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import type { LEvent } from "../LEvent.ts"
import { Thread, ThreadState } from "../Thread.ts"
import { Self } from "./Self.ts"

export const thread: Effect.Effect<Thread> = Effect.gen(function*() {
  return Thread({
    parent: yield* Effect.serviceOption(Self),
    events: yield* PubSub.unbounded<LEvent>(),
    state: ThreadState.default(),
    tools: Option.none(),
  })
})
