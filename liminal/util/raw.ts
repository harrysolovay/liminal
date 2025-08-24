import * as Effect from "effect/Effect"
import type { YieldWrap } from "effect/Utils"
import type { ExtractE, ExtractR } from "./extract.ts"

export type TemplateStringsArrayLike = {
  raw: readonly string[] | ArrayLike<string>
}

export const raw = Effect.fnUntraced(function*<Substitutions extends Array<unknown>>(
  template: TemplateStringsArrayLike,
  ...substitutions: Substitutions
): Generator<
  YieldWrap<
    Effect.Effect<Array<string>, ExtractE<Substitutions[number]>, ExtractR<Substitutions[number]>>
  >,
  string,
  never
> {
  return String.raw(
    template,
    ...yield* (Effect.all(substitutions.map((v) => Effect.isEffect(v) ? v : Effect.succeed(v))) as Effect.Effect<
      Array<string>,
      ExtractE<Substitutions[number]>,
      ExtractR<Substitutions[number]>
    >),
  )
})
