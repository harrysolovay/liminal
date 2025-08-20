import { sqliteThread } from "@liminal/sqlite"
import { Effect } from "effect"
import L from "liminal"
import { DbLive, ModelLive } from "./_layers.ts"
import { logger } from "./_logger.ts"

Effect.gen(function*() {
  yield* logger
  yield* L.user`Hey.`
  yield* L.assistant
}).pipe(
  sqliteThread({
    threadId: "some-id",
  }),
  Effect.provide([ModelLive, DbLive]),
  Effect.scoped,
  Effect.runFork,
)
