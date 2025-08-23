import { Effect, Layer } from "effect"
import { Digest, L } from "liminal"
import { ModelLive } from "./_layers.ts"

class Relationships extends Digest("examples/Relationships")<Relationships>() {}

const RelationshipsLive = Relationships.layer(
  Effect.fn(function*(_state, inbox) {
    yield* L.user`I received some new messages. The following is a summary of all new messages:`
    yield* inbox(
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
  }),
)

L.thread(
  L.user`My childhood dog Lola was the sweetest oddball. I miss her dearly.`,
  Relationships.digest,
  L.clear,
  L.user(Relationships),
  L.user`I'm feeling melancholy. Why might that be?`,
  L.assistant,
).pipe(
  L.thread,
  Effect.provide(
    Layer.provideMerge(RelationshipsLive, ModelLive),
  ),
  Effect.runFork,
)
