import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import { type Thread, ThreadName } from "../Thread.ts"
import { self } from "./self1.ts"

export const fqn = (id: string): Effect.Effect<void, never, Thread> =>
  Effect.map(self, (thread) => {
    thread.state.name = Option.some(ThreadName.make(id))
  })
