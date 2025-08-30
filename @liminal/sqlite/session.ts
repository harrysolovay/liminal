import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite"
import * as SqlClient from "@effect/sql/SqlClient"
import { SqlError } from "@effect/sql/SqlError"
import { eq, type InferInsertModel } from "drizzle-orm"
import * as Array from "effect/Array"
import * as Effect from "effect/Effect"
import * as FiberSet from "effect/FiberSet"
import * as Option from "effect/Option"
import type { ParseError } from "effect/ParseResult"
import * as PubSub from "effect/PubSub"
import * as Scope from "effect/Scope"
import { encodeLEvent, L, type LEvent, messageCodec, Thread, ThreadId, ThreadState } from "liminal"
import { extractRow0, extractRow0OrDie } from "./_common.ts"
import { statements } from "./statements.ts"
import * as T from "./tables/index.ts"

export const session: (init: {
  readonly threadId: string
}) => Effect.Effect<
  Thread,
  SqlError | ParseError,
  SqlClient.SqlClient | Scope.Scope
> = Effect.fnUntraced(
  function*({ threadId }) {
    const sql = yield* SqlClient.SqlClient
    for (const statement of statements) {
      yield* sql.unsafe(statement)
    }
    const { thread, head } = yield* ensure(threadId)
    yield* L.listen(handler(threadId, head)).pipe(
      Effect.provideService(L.self, thread),
    )
    return thread
  },
  Effect.provideServiceEffect(
    SqliteDrizzle.SqliteDrizzle,
    SqliteDrizzle.make({
      casing: "snake_case",
    }),
  ),
)

const ensure = Effect.fnUntraced(function*(threadId: string) {
  const db = yield* SqliteDrizzle.SqliteDrizzle
  const exists = yield* db
    .select({
      id: T.threads.id,
      system: T.threads.system,
      head: T.threads.head,
    })
    .from(T.threads)
    .where(eq(T.threads.id, threadId))
    .pipe(extractRow0)
  if (exists?.id) {
    const { system, head } = exists
    const messages = yield* db
      .select({
        encoded: T.messages.message,
      })
      .from(T.messages)
      .where(eq(T.messages.threadId, threadId))
      .leftJoin(T.events, eq(T.events.id, T.messages.eventId))
      .pipe(
        Effect.flatMap((rows) =>
          Effect.all(
            Array.map(rows, ({ encoded }) => messageCodec.decode(encoded)),
            { concurrency: "unbounded" },
          )
        ),
      )
    const thread = Thread({
      scope: yield* Scope.Scope,
      id: ThreadId.make(threadId),
      parent: yield* Effect.serviceOption(L.self),
      events: yield* PubSub.unbounded<LEvent>(),
      fibers: yield* FiberSet.make<void, never>(),
      state: ThreadState.make({
        system: Option.fromNullable(system),
        messages,
      }),
      tools: Option.none(),
    })
    return { thread, head }
  }
  yield* db.insert(T.threads).values({ id: threadId })
  const thread = Thread({
    scope: yield* Scope.Scope,
    id: ThreadId.make(threadId),
    parent: yield* Effect.serviceOption(L.self),
    events: yield* PubSub.unbounded<LEvent>(),
    fibers: yield* FiberSet.make<void, never>(),
    state: ThreadState.make({
      system: Option.none(),
      messages: [],
    }),
    tools: Option.none(),
  })
  return { thread, head: null }
})

const handler = (threadId: string, head: string | null) => {
  const threadIdsEqual = eq(T.threads.id, threadId)
  return Effect.fnUntraced(function*(event: LEvent) {
    const db = yield* SqliteDrizzle.SqliteDrizzle
    const { eventId } = yield* db
      .insert(T.events)
      .values({
        threadId,
        event: yield* encodeLEvent(event),
        parentId: head,
      })
      .returning({ eventId: T.events.id })
      .pipe(extractRow0OrDie)
    switch (event._tag) {
      case "system_set": {
        yield* db
          .update(T.threads)
          .set({ system: Option.getOrUndefined(event.system) })
          .where(threadIdsEqual)
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
        console.log(JSON.stringify(encoded), "\n\n")
        yield* db.insert(T.messages).values(encoded)
        break
      }
      case "messages_cleared": {
        yield* db.delete(T.messages).where(threadIdsEqual)
        break
      }
    }
  })
}
