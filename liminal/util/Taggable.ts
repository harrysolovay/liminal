import * as Effect from "effect/Effect"

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
  ...aRest: L
) => Effect.Effect<string | (undefined extends A0 ? undefined : never)> = Effect.fnUntraced(function*(a0, ...aRest) {
  if (!a0) return undefined as never
  const aRest_ = yield* Effect.all(
    aRest.map((v) => Effect.isEffect(v) ? v : Effect.succeed(v)),
  ) as never as Effect.Effect<Array<unknown>>

  if (typeof a0 === "string") {
    return [a0, ...aRest_].join("")
  } else if (Effect.isEffect(a0)) {
    return [yield* a0 as never as Effect.Effect<any>, aRest_].join("")
  }
  return String.raw(a0, ...aRest_)
})
