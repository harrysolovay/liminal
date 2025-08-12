import * as Effect from "effect/Effect"
import { Thread, ThreadId } from "./ThreadInitial.ts"

export const id = (id: string | ThreadId): Effect.Effect<void, never, Thread> =>
  Effect.map(Thread, (thread) => {
    thread.id = ThreadId.make(id)
  })
