import { Effect } from "effect"
import L from "liminal"
import { ModelLive } from "./_layers.ts"
import { logger } from "./_logger.ts"
import { SYSTEM } from "./_messages.ts"

Effect.gen(function*() {
  yield* logger

  yield* L.sequence(
    L.system(SYSTEM),
    L.user`Decide on a subtopic for us to discuss within the domain of technological futurism.`,
    L.assistant,
    L.user`Great, please teach something interesting about this choice of subtopic.`,
    L.assistant,
  )

  let i = 0
  while (i < 3) {
    yield* L.branch(
      L.user`Please reply to the last message on my behalf.`,
      L.assistant,
    ).pipe(
      L.user,
    )
    yield* L.assistant
    i++
  }
  yield* L.user`Please summarize the key points from our conversation.`
  yield* L.assistant
}).pipe(
  L.thread,
  Effect.scoped,
  Effect.provide(ModelLive),
  Effect.runFork,
)
