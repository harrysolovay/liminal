import * as Effect from "effect/Effect"
import type { ExtractE, ExtractR } from "./extract.ts"

export type TemplateStringsArrayLike = {
  raw: readonly string[] | ArrayLike<string>
}

export const raw: <Substitutions extends Array<unknown>>(
  template: TemplateStringsArrayLike,
  ...substitutions: Substitutions
) => Effect.Effect<
  string,
  ExtractE<Substitutions[number]>,
  ExtractR<Substitutions[number]>
> = Effect.fnUntraced(function*(template, ...substitutions) {
  return String.raw(
    template,
    ...yield* (Effect.all(
      substitutions.map((v) =>
        Effect.isEffect(v)
          ? v
          : Effect.succeed(v)
      ),
    ) as never as Effect.Effect<Array<unknown>>),
  )
})
