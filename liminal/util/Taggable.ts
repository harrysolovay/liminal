import * as Effect from "effect/Effect"
import { fixRaw } from "./fixRaw.ts"

/** Append a user message to the conversation. */
export type Taggable<A, E, R> = <L extends Array<unknown>, E1 = never, R1 = never>(
  template?:
    | TemplateStringsArray
    | string
    | Effect.Effect<string | undefined, E1, R1>
    | undefined,
  ...substitutions: L
) => Effect.Effect<
  A,
  ([ExtractEffect<L>] extends [never] ? never : Effect.Effect.Error<ExtractEffect<L>>) | E | E1,
  ([ExtractEffect<L>] extends [never] ? never : Effect.Effect.Context<ExtractEffect<L>>) | R | R1
>

type ExtractEffect<T extends Array<unknown>> = Extract<T[number], Effect.All.EffectAny>

export const normalize: <
  A0 extends
    | TemplateStringsArray
    | string
    | Effect.Effect<string | undefined, any, any>
    | undefined,
  L extends Array<unknown>,
>(
  a0: A0,
  aRest: L,
) => Effect.Effect<string | (undefined extends A0 ? undefined : never)> = Effect.fnUntraced(function*(a0, aRest) {
  let a0_: TemplateStringsArray | string | undefined
  if (Effect.isEffect(a0)) {
    a0_ = yield* a0 as Effect.Effect<TemplateStringsArray | string | undefined>
  } else {
    a0_ = a0
  }
  if (!a0_) return undefined as never
  const aRest_ = yield* Effect.all(
    aRest.map((v) =>
      Effect.isEffect(v)
        ? v
        : Effect.succeed(v)
    ),
  ) as never as Effect.Effect<Array<unknown>>
  if (typeof a0_ === "string") {
    if (aRest_.length === 0) {
      return a0_
    }
    return [a0_, ...aRest_].join("")
  }
  return fixRaw(a0_, aRest_)
})
