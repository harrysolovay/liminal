import { Effect } from "effect"
import { L } from "liminal"
import { ModelLive } from "./_layers.ts"
import { logger } from "./_logger.ts"

Effect.gen(function*() {
  yield* logger
  yield* L.user`Hey`
  yield* L.assistant
}).pipe(
  L.strand,
  Effect.provide(ModelLive),
  Effect.scoped,
  Effect.runFork,
)
