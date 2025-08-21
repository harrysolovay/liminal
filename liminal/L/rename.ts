import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import { ThreadRenamedEvent } from "../LEvent.ts"
import { Thread, ThreadName } from "../Thread.ts"
import { self } from "./self1.ts"

// MORE THAN JUST NAME: metadata
export const rename: (name: string) => Effect.Effect<void, never, Thread> = Effect.fnUntraced(function*(name) {
  const { state, events } = yield* self
  const name_ = ThreadName.make(name)
  state.name = Option.some(name_)
  yield* events.publish(ThreadRenamedEvent.make({
    name: Option.some(name_),
  }))
})
