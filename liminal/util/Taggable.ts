import * as Effect from "effect/Effect"

export type Taggable<A, E = never, R = never> = <L extends Array<unknown>, E1 = never, R1 = never>(
  template?: TaggableArg0 | Effect.Effect<string | undefined, E1, R1>,
  ...substitutions: L
) => Effect.Effect<
  A,
  ([ExtractEffect<L>] extends [never] ? never : Effect.Effect.Error<ExtractEffect<L>>) | E | E1,
  ([ExtractEffect<L>] extends [never] ? never : Effect.Effect.Context<ExtractEffect<L>>) | R | R1
>

export type TaggableArg0 = TemplateStringsArray | string | undefined

type ExtractEffect<T extends Array<unknown>> = Extract<T[number], Effect.All.EffectAny>
