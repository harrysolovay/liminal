import * as Effect from "effect/Effect"
import { YieldWrap } from "effect/Utils"
import type { ExtractE, ExtractR } from "./extract.ts"
import { raw, type TemplateStringsArrayLike } from "./raw.ts"

export type TaggableArg0 = TemplateStringsArrayLike | string | Effect.Effect<string, any, any>
export type TaggableArgRest<E0 extends TaggableArg0> = E0 extends TemplateStringsArrayLike ? Array<unknown> : []

export const normalize = Effect.fnUntraced(function*<
  A0 extends TaggableArg0,
  ARest extends TaggableArgRest<A0>,
>(
  a0: A0,
  ...aRest: ARest
): Generator<
  YieldWrap<
    Effect.Effect<
      string,
      ExtractE<A0 | ARest[number]>,
      ExtractR<A0 | ARest[number]>
    >
  >,
  string,
  never
> {
  if (Effect.isEffect(a0)) {
    return yield* a0
  }
  if (typeof a0 === "string") {
    return a0
  }
  return yield* raw(a0, ...aRest)
})
