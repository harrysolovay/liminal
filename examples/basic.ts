import { Effect } from "effect"
import { L } from "liminal"
import { ModelLive, TurboLive } from "./_layers.ts"
import { logger } from "./_logger.ts"

Effect.gen(function*() {
  yield* logger

  yield* L.user`Hey, how are you?`
  yield* L.assistant
  yield* L.user`Turn it into a song`
  yield* L.assistant
  const alternatives = yield* Effect.all({
    rap: L.branch(
      L.user`Now in the genre of rap.`,
      L.assistant,
    ).pipe(
      Effect.provide(TurboLive),
    ),
    pop: L.branch(
      L.user`Now in the genre of pop.`,
      L.assistant,
    ),
  }, { concurrency: "unbounded" })
  console.log({ alternatives })
  const messages = yield* L.messages
  console.log({ messages })
}).pipe(
  L.strand,
  Effect.provide(ModelLive),
  Effect.scoped,
  Effect.runFork,
)
