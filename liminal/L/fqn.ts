import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import { type Thread, ThreadName } from "../Thread.ts"
import { Self } from "./Self.ts"

export const fqn = (id: string): Effect.Effect<void, never, Thread> =>
  Effect.map(Self, (thread) => {
    thread.state.name = Option.some(ThreadName.make(id))
  })
