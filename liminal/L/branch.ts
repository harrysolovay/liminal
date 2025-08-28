import * as Effect from "effect/Effect"
import * as FiberSet from "effect/FiberSet"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import * as Scope from "effect/Scope"
import type { LEvent } from "../LEvent.ts"
import { Thread, ThreadState } from "../Thread.ts"
import { self } from "./self.ts"

export const branch: Effect.Effect<Thread, never, Thread | Scope.Scope> = Effect.gen(function*() {
  const parent = yield* self
  return Thread({
    id: parent.id,
    parent: Option.some(parent),
    events: yield* PubSub.unbounded<LEvent>(),
    daemons: yield* FiberSet.make<void, never>(),
    state: ThreadState.make({
      system: parent.state.system,
      messages: [...parent.state.messages ?? []],
    }),
    tools: parent.tools.pipe(
      Option.map((v) => new Set(v)),
    ),
  })
})
