import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import { Self } from "./Self.ts"
import { type Thread, ThreadFqn } from "./Thread.ts"

export const fqn = (id: string): Effect.Effect<void, never, Thread> =>
  Effect.map(Self, (thread) => {
    thread.state.fqn = Option.some(ThreadFqn.make(id))
  })
