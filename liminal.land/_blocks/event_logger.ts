import { Console, Effect, flow, Stream } from "effect"
import { L, LPretty } from "liminal"
import { ModelLive } from "./ModelLive"

Effect.gen(function*() {
  yield* L.events.pipe(
    // For each event...
    Stream.runForEach(
      // Prettify & log.
      flow(LPretty.event, Console.log),
    ),
    // Fork to consume the stream without blocking.
    Effect.fork,
  )

  yield* L.user`Welcome to the cotton club.`
  yield* L.assistant
}).pipe(
  L.strand,
  Effect.provide(ModelLive),
  Effect.runFork,
)
