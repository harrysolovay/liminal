import { Effect } from "effect"
import { L } from "liminal"
import { ModelLive } from "./_layers.ts"
import { logger } from "./_logger.ts"

L.line(
  L.listen(logger),
  L.user`Hey.`,
  L.assistant,
).pipe(
  L.provide(
    L.thread,
  ),
  Effect.provide(ModelLive),
  Effect.scoped,
  Effect.runFork,
)
