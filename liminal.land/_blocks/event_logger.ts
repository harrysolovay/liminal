import { Console, Effect, flow } from "effect"
import { L } from "liminal"
import { ModelLive } from "./ModelLive"

Effect.gen(function*() {
  // For each event...
  yield* L.listen(
    // Prettify & log.
    Console.log,
  )
  yield* L.user`Welcome to the cotton club.`
  yield* L.assistant
}).pipe(
  L.scoped(
    L.thread,
  ),
  Effect.provide(ModelLive),
  Effect.runFork,
)
