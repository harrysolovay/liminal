import * as Effect from "effect/Effect"
import { normalizeRaw } from "./fixRaw.ts"

export type Taggable<A, E, R> = <L extends Array<unknown>, E1 = never, R1 = never>(
  template?: TaggableArg0 | Effect.Effect<string | undefined, E1, R1>,
  ...substitutions: L
) => Effect.Effect<
  A,
  ([ExtractEffect<L>] extends [never] ? never : Effect.Effect.Error<ExtractEffect<L>>) | E | E1,
  ([ExtractEffect<L>] extends [never] ? never : Effect.Effect.Context<ExtractEffect<L>>) | R | R1
>

export type TaggableArg0 = TemplateStringsArray | string | undefined

type ExtractEffect<T extends Array<unknown>> = Extract<T[number], Effect.All.EffectAny>

export const normalize: <
  A0 extends TaggableArg0 | Effect.Effect<string | undefined, any, any>,
  L extends Array<unknown>,
>(
  a0: A0,
  aRest: L,
) => Effect.Effect<string | (undefined extends A0 ? undefined : never)> = Effect.fnUntraced(function*(a0, aRest) {
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
  ) as Effect.Effect<Array<unknown>>
  return typeof a0_ === "string"
    ? aRest_.length === 0
      ? a0_
      : [a0_, ...aRest_].join("")
    : normalizeRaw(a0_, aRest_)
})
