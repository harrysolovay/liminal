import { HttpServerRequest } from "@effect/platform"
import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite"
import { session } from "@liminal/sqlite"
import { DurableClass } from "@liminal/workerd"
import { Effect, Schema } from "effect"
import { L } from "liminal"
import { ModelLive } from "./layers.ts"

// An infinite scary story.
export class DurableThread extends Effect.gen(function*() {
  const { threadId } = yield* HttpServerRequest.schemaBodyJson(
    Schema.Struct({
      threadId: Schema.String,
    }),
  )
  return yield* Effect.gen(function*() {
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
      session({ threadId }),
    ),
  )
}).pipe(
  Effect.provide([ModelLive, SqliteDrizzle.layer]),
  DurableClass,
) {}
