import { Action } from "../Action.ts"
import type { Embedded } from "../events/Embedded.ts"
import type { EmbeddingRequested } from "../events/EmbeddingRequested.ts"
import type { Spec } from "../Spec.ts"
import { assert } from "../util/assert.ts"
import { peekLast } from "../util/peekLast.ts"

export interface embed extends Action<"embed", Spec.Make<{ Event: EmbeddingRequested | Embedded }>> {}

export function* embed(value: string): Generator<embed, Array<number>> {
  return yield Action("embed", async (scope) => {
    const model = peekLast(scope.embeddingModels)
    assert(model)
    scope.event({
      type: "embedding_requested",
      value,
    })
    const embedding = await model.embed(value)
    scope.event({
      type: "embedded",
      value,
      embedding,
    })
    return {
      ...scope,
      nextArg: scope.value,
    }
  })
}
