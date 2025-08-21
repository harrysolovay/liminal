import { SqliteDrizzle } from "@effect/sql-drizzle/Sqlite"
import { SqlError } from "@effect/sql/SqlError"
import { and, eq, gte, type InferInsertModel } from "drizzle-orm"
import * as Array from "effect/Array"
import * as Cause from "effect/Cause"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import type { ParseError } from "effect/ParseResult"
import * as PubSub from "effect/PubSub"
import * as Scope from "effect/Scope"
import L, { encodeLEvent, type LEvent, messageCodec, type Sequencer, Thread, ThreadId, ThreadState } from "liminal"
import { extractRow0OrDie } from "./_common.ts"
import * as T from "./tables/index.ts"

const create = Effect.gen(function*() {
  const db = yield* SqliteDrizzle
  const { threadId } = yield* db
    .insert(T.threads)
    .values({})
    .returning({
      threadId: T.threads.id,
    })
    .pipe(extractRow0OrDie)

  const thread = Thread({
    id: ThreadId.make(threadId),
    parent: yield* Effect.serviceOption(L.self),
    events: yield* PubSub.unbounded<LEvent>(),
    state: ThreadState.make({
      system: Option.none(),
      messages: [],
    }),
    tools: Option.none(),
  })
  return { threadId, thread }
})

const hydrate = Effect.fnUntraced(function*(threadId: string) {
  const db = yield* SqliteDrizzle
  const { system, clearedAtTimestamp } = yield* db
    .select({
      system: T.threads.system,
      clearedAt: T.threads.clearedAt,
      clearedAtTimestamp: T.events.timestamp,
    })
    .from(T.threads)
    .innerJoin(T.events, eq(T.threads.clearedAt, T.events.id))
    .pipe(extractRow0OrDie)
  const messages = yield* db
    .select({
      encoded: T.messages.message,
    })
    .from(T.messages)
    .innerJoin(T.events, eq(T.messages.eventId, T.events.id))
    .where(
      and(
        eq(T.messages.threadId, threadId),
        gte(T.events.timestamp, clearedAtTimestamp),
      ),
    )
    .pipe(
      Effect.flatMap((rows) =>
        Effect.all(
          Array.map(rows, ({ encoded }) => messageCodec.decode(encoded)),
          { concurrency: "unbounded" },
        )
      ),
    )
  return Thread({
    id: ThreadId.make(threadId),
    parent: yield* Effect.serviceOption(L.self),
    events: yield* PubSub.unbounded<LEvent>(),
    state: ThreadState.make({
      system: Option.fromNullable(system),
      messages,
    }),
    tools: Option.none(),
  })
})

export const syncThread: (init?: {
  readonly threadId?: string | undefined
}) => Sequencer<Thread, SqlError | ParseError | Cause.NoSuchElementException, SqliteDrizzle> = (
  init,
) =>
  Effect.fnUntraced(function*(...steps) {
    let thread: Thread
    let threadId = init?.threadId!
    let currentEventId: string | null = null
    if (!init?.threadId) {
      ;({ threadId, thread } = yield* create)
    } else {
      thread = yield* hydrate(init.threadId)
    }
    const listen = L.listen(
      Effect.fnUntraced(function*(event) {
        const db = yield* SqliteDrizzle
        const { eventId } = yield* db
          .insert(T.events)
          .values({
            threadId,
            event: yield* encodeLEvent(event),
            parentId: currentEventId,
          })
          .returning({
            eventId: T.events.id,
          })
          .pipe(extractRow0OrDie)
        currentEventId = eventId
        switch (event._tag) {
          case "system_set": {
            yield* db
              .update(T.threads)
              .set({
                system: Option.getOrUndefined(event.system),
              })
              .where(eq(T.threads.id, threadId))
            break
          }
          case "messages_appended": {
            const encoded = yield* Effect.all(
              event.messages.map((message) =>
                messageCodec.encode(message).pipe(
                  Effect.map(
                    (message): InferInsertModel<typeof T.messages> => ({ message, eventId, threadId }),
                  ),
                )
              ),
            )
            yield* db
              .insert(T.messages)
              .values(encoded)
              .returning({
                messageId: T.messages.id,
              })
            break
          }
          case "messages_cleared": {
            yield* db
              .delete(T.messages)
              .where(eq(T.threads.id, threadId))
            break
          }
        }
      }),
    )
    return yield* Effect.scopedWith((scope) =>
      thread(
        listen.pipe(
          Effect.provideService(Scope.Scope, scope),
        ),
        ...steps,
      )
    ) as Effect.Effect<never>
  })
