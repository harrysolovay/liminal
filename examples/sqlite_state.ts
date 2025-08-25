import { sync } from "@liminal/sqlite"
import { Effect } from "effect"
import { L } from "liminal"
import { DbLive, ModelLive } from "./_layers.ts"
// import { logger } from "./_logger.ts"

Effect.gen(function*() {
  yield* L.user`Hey.`
  yield* L.assistant
  console.log(yield* L.messages)
}).pipe(
  L.provide(
    sync({
      threadId: "sqlite-state-sync",
    }),
  ),
  Effect.scoped,
  Effect.provide([ModelLive, DbLive]),
  Effect.runFork,
)
