import * as Effect from "effect/Effect"
import { flow } from "effect/Function"
import * as Pipeable from "effect/Pipeable"
import { self } from "./L/self.ts"
import { sequence } from "./L/sequence.ts"
import type { Thread } from "./Thread.ts"

export const ThreadFactory = <E, R>(thread: Effect.Effect<Thread, E, R>) =>
  Object.assign(
    flow(
      sequence,
      Effect.provideServiceEffect(self, thread),
    ),
    thread,
    {
      pipe() {
        return Pipeable.pipeArguments(this, arguments)
      },
    },
  )
