import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import type { Thread } from "../Thread.ts"
import type { Taggable } from "../util/Taggable.ts"
import { raw } from "./raw.ts"
import { Self } from "./Self.ts"

/** Set the thread's system instruction. */
export const system: Taggable<Option.Option<string>, never, Thread> = Effect.fnUntraced(function*(a0, ...aRest) {
  const { state } = yield* Self
  const { system } = state
  state.system = a0 ? Option.some(yield* raw(a0, ...aRest)) : Option.none()
  return system
})
