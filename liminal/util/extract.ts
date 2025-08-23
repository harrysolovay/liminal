import * as Effect from "effect/Effect"

export type ExtractE<T> = [Extract<T, Effect.Effect<any, any, any>>] extends [never] ? never
  : Effect.Effect.Error<Extract<T, Effect.Effect<any, any, any>>>

export type ExtractR<T> = [Extract<T, Effect.Effect<any, any, any>>] extends [never] ? never
  : Effect.Effect.Context<Extract<T, Effect.Effect<any, any, any>>>
