import { Effect } from "effect"
import { L } from "liminal"
import { ModelLive } from "./_layers.ts"
import { logger } from "./_logger.ts"

L.line(
  logger,
  L.user`Hey.`,
  L.assistant,
).pipe(
  L.scoped(
    L.thread,
  ),
  Effect.provide(ModelLive),
  Effect.runFork,
)
