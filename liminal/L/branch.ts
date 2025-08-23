import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import type { LEvent } from "../LEvent.ts"
import { Thread, ThreadState } from "../Thread.ts"
import { self } from "./self.ts"

export const branch: Effect.Effect<Thread, never, Thread> = Effect.gen(function*() {
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
