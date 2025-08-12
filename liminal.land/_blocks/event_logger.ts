import { Console, Effect, flow } from "effect"
import { L, LPretty } from "liminal"
import { ModelLive } from "./ModelLive"

Effect.gen(function*() {
  // For each event...
  yield* L.listen(
    // Prettify & log.
    flow(LPretty.event, Console.log),
  )
  yield* L.user`Welcome to the cotton club.`
  yield* L.assistant
}).pipe(
  L.root,
  Effect.scoped,
  Effect.provide(ModelLive),
  Effect.runFork,
)
