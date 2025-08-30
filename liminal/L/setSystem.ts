import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import type { YieldWrap } from "effect/Utils"
import { SystemSetEvent } from "../LEvent.ts"
import { normalize, type TaggableArg0, type TaggableArgRest } from "../util/Taggable.ts"
import { self } from "./self.ts"

/** Set the thread's system instruction. */
export const setSystem = Effect.fnUntraced(function*<
  A0 extends TaggableArg0,
  ARest extends TaggableArgRest<A0>,
>(
  a0: A0,
  ...aRest: ARest
): Generator<
  YieldWrap<
    typeof self | ReturnType<typeof normalize<A0, ARest>> | Effect.Effect<boolean>
  >,
  Option.Option<string>,
  never
> {
  const { state, events } = yield* self
  const system = a0
    ? Option.some(yield* normalize(a0, ...aRest))
    : Option.none()
  const { system: previous } = state
  state.system = system
  yield* events.publish(new SystemSetEvent({ system }))
  return previous
})
