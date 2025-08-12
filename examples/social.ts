import { Effect } from "effect"
import { L } from "liminal"
import { ModelLive } from "./_layers.ts"

Effect.gen(function*() {
  yield* L.user``

  const daniel = yield* L.thread
  const julia = yield* L.thread

  yield* daniel(
    L.user`I'm on a date with ${julia}. What should I ask her about herself?`,
    L.assistant.pipe(L.to(julia)),
  )

  yield* julia(
    L.user`${daniel} just asked me a question. How shall I respond?`,
    L.assistant.pipe(L.to(daniel)),
  )
}).pipe(
  L.root,
  Effect.provide(ModelLive),
  Effect.runFork,
)
