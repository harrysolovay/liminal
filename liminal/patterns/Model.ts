import type { AiError } from "@effect/ai/AiError"
import type { AiLanguageModel } from "@effect/ai/AiLanguageModel"
import type { AiModel } from "@effect/ai/AiModel"
import * as Effect from "effect/Effect"
import { assistant } from "../assistant.ts"
import type { Thread } from "../ThreadInitial.ts"
import { user } from "../user.ts"

export const coalesce: <E, R, M extends Array<AiModel<any, any>>>(
  effect: Effect.Effect<any, E, R>,
  models: M,
) => Effect.Effect<
  string,
  AiError | E,
  Thread | AiLanguageModel | ([M[number]] extends [AiModel<any, infer R>] ? R : never)
> = Effect.fn(
  function*(effect, models) {
    const all = yield* Effect.all(models.map((model) => effect.pipe(Effect.provide(model)))) as Effect.Effect<
      Array<unknown>
    >
    yield* user`
      Coalesce the following items into a single item:

      ---

      ${all.map((item) => JSON.stringify(item, null, 2)).join("\n\n---")}
    `
    return yield* assistant
  },
)
