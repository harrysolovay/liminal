import type { AgentSource } from "../AgentSource.ts"
import type { LEvent } from "../LEvent/LEvent.ts"
import type { Catch } from "../Rune/Catch.ts"
import type { Rune } from "../Rune/Rune.ts"
import type { DeferredOr } from "../util/DeferredOr.ts"
import type { LBase } from "./_LBase.ts"

export { catch_ as catch }

interface catch_<T, E extends LEvent> extends LBase<Catch<E>, CatchResult<T>> {}

export type CatchResult<T> = {
  value: T
  thrown?: never
} | {
  value?: never
  thrown: unknown
}

/** Execute the agent and capture either the result value or any throws. */
declare function catch_<Y extends Rune, T>(source: DeferredOr<AgentSource<Y, T>>): catch_<T, Y["event"]>
