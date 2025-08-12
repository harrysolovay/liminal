import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import { type Thread, ThreadFqn, threadTag } from "./Thread.ts"

export const fqn = (id: string): Effect.Effect<void, never, Thread> =>
  Effect.map(threadTag, (thread) => {
    thread.state.fqn = Option.some(ThreadFqn.make(id))
  })
