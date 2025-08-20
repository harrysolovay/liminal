import { Message } from "@effect/ai/AiInput"
import { SqliteDrizzle } from "@effect/sql-drizzle/Sqlite"
import { SqlError } from "@effect/sql/SqlError"
import { eq, type InferInsertModel } from "drizzle-orm"
import * as Array from "effect/Array"
import * as Cause from "effect/Cause"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import type { ParseError } from "effect/ParseResult"
import * as PubSub from "effect/PubSub"
import * as Schema from "effect/Schema"
import * as Scope from "effect/Scope"
import L, { encodeLEvent, type LEvent, type Sequencer, Thread, ThreadName, ThreadState } from "liminal"
import * as T from "./tables/index.ts"

const messageCodec = {
  decode: Schema.decode(Message),
  encode: Schema.encode(Message),
}

export const sqliteThread: (init: {
  readonly threadId?: string | undefined
}) => Sequencer<Thread, SqlError | ParseError | Cause.NoSuchElementException, SqliteDrizzle> = (
  { threadId: threadId_ },
) =>
  Effect.fnUntraced(function*(...steps) {
    const db = yield* SqliteDrizzle
    let {
      headEventId: previousEventId,
      headMessageId: previousMessageId,
      name,
      system,
      threadId,
    } = yield* db
      .insert(T.threads)
      .values({ threadId: threadId_ })
      .onConflictDoNothing()
      .returning({
        threadId: T.threads.threadId,
        system: T.threads.system,
        name: T.threads.name,
        headEventId: T.threads.headEventId,
        headMessageId: T.threads.headMessageId,
      })
      .pipe(
        Effect.flatMap(([e0]) => Effect.fromNullable(e0)),
      )
    const messages = yield* db
      .select({ encoded: T.messages.message })
      .from(T.messages)
      .where(eq(T.messages.threadId, threadId))
      .pipe(
        Effect.flatMap((rows) =>
          Effect.all(
            Array.map(rows, ({ encoded }) => messageCodec.decode(encoded)),
            { concurrency: "unbounded" },
          )
        ),
      )
    const thread = Thread({
      parent: yield* Effect.serviceOption(L.Self),
      events: yield* PubSub.unbounded<LEvent>(),
      state: ThreadState.make({
        name: Option.fromNullable(name).pipe(Option.map(ThreadName.make)),
        system: Option.fromNullable(system),
        messages,
      }),
      tools: Option.none(),
    })
    const listen = L.listen(
      Effect.fnUntraced(function*(event) {
        const { eventId } = yield* db
          .insert(T.events)
          .values({
            threadId,
            event: yield* encodeLEvent(event),
            previousEventId,
          })
          .returning({
            eventId: T.events.eventId,
          })
          .pipe(
            Effect.flatMap(([v]) => Effect.fromNullable(v)),
          )
        previousEventId = eventId
        switch (event._tag) {
          case "system_set": {
            yield* db
              .update(T.threads)
              .set({
                system: Option.getOrUndefined(event.system),
              })
              .where(eq(T.threads.threadId, threadId))
            break
          }
          case "messages_appended": {
            const encoded = yield* Effect.all(
              event.messages.map((message) =>
                messageCodec.encode(message).pipe(
                  Effect.map((message): InferInsertModel<typeof T.messages> => ({
                    message,
                    eventId,
                    previousMessageId,
                    threadId,
                  })),
                )
              ),
            )
            previousMessageId = yield* db
              .insert(T.messages)
              .values(encoded)
              .returning({
                messageId: T.messages.messageId,
              })
              .pipe(
                Effect.flatMap((v) => Effect.fromNullable(v.pop()?.messageId)),
              )
            break
          }
          case "messages_cleared": {
            yield* db
              .delete(T.messages)
              .where(eq(T.threads.threadId, threadId))
            previousMessageId = null
            break
          }
        }
      }),
    )
    return yield* Effect.scopedWith((scope) =>
      thread(
        listen.pipe(Effect.provideService(Scope.Scope, scope)),
        ...steps,
      )
    ) as Effect.Effect<never>
  })
