import { session } from "@liminal/sqlite"
import { Effect } from "effect"
import { L } from "liminal"
import { ModelLive, SqlClientLive } from "./_layers.ts"

Effect.gen(function*() {
  const messages = yield* L.messages
  const isFirst = !messages.length
  if (isFirst) {
    yield* L.setSystem`
      Never ask for clarification.

      Write passages of a scary story.

      Keep the story moving along and evolving forever.
    `
  }
  const passage = yield* L.line(
    L.user`${isFirst ? "First" : "Next"} passage please.`,
    L.assistant,
  ).pipe(
    L.scoped(
      L.branch,
    ),
  )
  yield* L.user(passage)
}).pipe(
  L.scoped(
    session({
      threadId: "sqlite-state-sync",
    }),
  ),
  Effect.provide([ModelLive, SqlClientLive]),
  Effect.runFork,
)
