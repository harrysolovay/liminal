// @ts-nocheck

import { Effect, Schema } from "effect"
import L, { Digest } from "liminal"

// schema should be optional
class Relationships extends Digest("liminal/Relationships", Schema.String)<Relationships>() {}

// An fnUntraced
const RelationshipsLive = Relationships.fn(function*(state, inbox) {
  yield* L.user`
    I received some new messages. The following is a summary of all new messages:
  `
  yield* inbox(
    L.filter`From or related to Lola.`,
    L.user`Summarize these messages.`,
    L.assistant.pipe(
      Effect.tap(L.clear),
    ),
  ).pipe(
    L.user,
  )
  yield* L.user`Integrate this summary of messages into the existing conversation.`
  return yield* L.assistant.pipe(
    Effect.tap(L.clear),
  )
})

const root = Effect.gen(function*() {
  const initial = yield* Relationships
  yield* L.user`...`
  yield* Relationships.digest
  yield* L.user`...`
  yield* Relationships.digest
  const final = yield* Relationships
}).pipe(
  Effect.provide(RelationshipsLive),
  L.thread,
)
