import * as Effect from "effect/Effect"
import { normalizeRaw } from "../util/normalizeRaw.ts"
import type { TaggableArg0 } from "../util/Taggable.ts"

export const raw: <
  A0 extends TaggableArg0 | Effect.Effect<string | undefined, any, any>,
  L extends Array<unknown>,
>(
  a0: A0,
  ...aRest: L
) => Effect.Effect<
  string | (undefined extends A0 ? undefined : never)
> = Effect.fnUntraced(function*(a0, ...aRest) {
  const a0_: TaggableArg0 = Effect.isEffect(a0)
    ? yield* a0 as Effect.Effect<TaggableArg0>
    : a0
  if (!a0_) return undefined as never
  const aRest_ = yield* Effect.all(
    aRest.map((v) =>
      Effect.isEffect(v)
        ? v
        : Effect.succeed(v)
    ),
  ) as never as Effect.Effect<Array<unknown>>
  return typeof a0_ === "string"
    ? aRest_.length === 0
      ? a0_
      : [a0_, ...aRest_].join("")
    : normalizeRaw(a0_, aRest_)
})
