import * as Effect from "effect/Effect"
import type { Thread } from "../Thread.ts"
import { self } from "./self.ts"

export const provide = <E, R>(
  thread: Effect.Effect<Thread, E, R>,
) =>
<A1, E1, R1>(
  a: Effect.Effect<A1, E1, R1>,
): Effect.Effect<A1, E | E1, R | Exclude<R1, Thread>> => Effect.provideServiceEffect(self, thread)(a)
