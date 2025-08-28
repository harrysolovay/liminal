import { session } from "@liminal/sqlite"
import { Effect } from "effect"
import { L } from "liminal"
import { DbLive, ModelLive } from "./_layers.ts"
import { logger } from "./_logger.ts"

Effect.gen(function*() {
  // let i = 0
  // yield* L.listen(() =>
  //   Effect.sleep(5000).pipe(
  //     Effect.andThen(() => Effect.log(`ITERATION: ${i++}`)),
  //   )
  // )
  yield* logger
  const messages = yield* L.messages
  yield* L.setSystem`
      Never ask for clarification.

      Write passages of a scary story.

      Keep the story moving along and evolving forever.
    `
  yield* L.user`${messages.length ? "Next" : "First"} passage please.`
  yield* L.assistant
}).pipe(
  L.make(
    session({
      threadId: "sqlite-state-sync",
    }),
  ),
  Effect.scoped,
  Effect.provide([ModelLive, DbLive]),
  Effect.runFork,
)
