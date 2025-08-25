import { sync } from "@liminal/sqlite"
import { Console, Effect } from "effect"
import { L } from "liminal"
import { DbLive, ModelLive } from "./_layers.ts"

Effect.gen(function*() {
  const messages = yield* L.messages
  yield* L.user(
    messages.length ? "The next passage please." : "Tell me a scary story.",
  )
  const next = yield* L.assistant
  yield* Console.log(next)
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
