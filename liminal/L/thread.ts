import * as Effect from "effect/Effect"
import * as FiberSet from "effect/FiberSet"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import * as Scope from "effect/Scope"
import type { LEvent } from "../LEvent.ts"
import { Thread, ThreadId, ThreadState } from "../Thread.ts"
import { self } from "./self.ts"

export const thread: Effect.Effect<Thread, never, Scope.Scope> = Effect.gen(function*() {
  return Thread({
    scope: yield* Scope.Scope,
    id: ThreadId.make(crypto.randomUUID()),
    parent: yield* Effect.serviceOption(self),
    events: yield* PubSub.unbounded<LEvent>(),
    fibers: yield* FiberSet.make<void, never>(),
    state: ThreadState.default(),
    tools: Option.none(),
  })
})
