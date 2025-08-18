import { PgDrizzle } from "@effect/sql-drizzle/Pg"
import * as Effect from "effect/Effect"
import * as ExecutionStrategy from "effect/ExecutionStrategy"
import { flow } from "effect/Function"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import * as Scope from "effect/Scope"
import L, { type LEvent, type Sequencer, Thread, ThreadName, ThreadState } from "liminal"
// import { events } from "./schema/events.ts"
// import { messages } from "./schema/messages.ts"

export interface bind extends Sequencer<Thread, PgDrizzle>, Effect.Effect<Thread, never, PgDrizzle> {}

const bind_ = Effect.fnUntraced(function*(_id: string) {
  const pg = yield* PgDrizzle
  return yield* Effect.gen(function*() {
    const scope = yield* Scope.make(ExecutionStrategy.parallel)
    const thread = Thread({
      parent: yield* Effect.serviceOption(L.Self),
      events: yield* PubSub.unbounded<LEvent>(),
      state: ThreadState.make({
        name: Option.some(ThreadName.make("")),
        system: Option.some(""),
        messages: [],
      }),
      tools: Option.none(),
    })
    yield* L.listen(
      Effect.fnUntraced(function*(event) {
        switch (event._tag) {
          case "system_set": {
            break
          }
          case "messages_appended": {
            break
          }
          case "messages_cleared": {
            break
          }
        }
      }),
    ).pipe(
      Effect.provideService(Scope.Scope, scope),
    )
    return thread
  })
})

export const bind: (id: string) => bind = (id: string) =>
  Object.assign(
    flow(
      L.sequence,
      Effect.provideServiceEffect(L.Self, bind_(id)),
    ),
    bind_(id),
  ) as never
