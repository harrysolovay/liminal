import type { Effect } from "effect/Effect"
import type { YieldWrap } from "effect/Utils"

export type Any = YieldWrap<Effect<any, any, any>>

export type E<Y> = [Y] extends [never] ? never
  : [Y] extends [YieldWrap<Effect<infer _A, infer E, infer _R>>] ? E
  : never

export type R<Y> = [Y] extends [never] ? never
  : [Y] extends [YieldWrap<Effect<infer _A, infer _E, infer R>>] ? R
  : never
