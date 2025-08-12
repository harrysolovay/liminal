import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import { Thread } from "./ThreadInitial.ts"
import { normalize, type Taggable } from "./util/Taggable.ts"

/** Set the system instruction for the current strand. */
export const system: Taggable<Option.Option<string>, never, Thread> = Effect.fnUntraced(function*(a0, ...aRest) {
  const conversation = yield* Thread
  const { system } = conversation
  conversation.system = a0 ? Option.some(yield* normalize(a0, aRest)) : Option.none()
  return system
})
