import { Effect } from "effect"
import { L } from "liminal"
import { ModelLive } from "./_layers.ts"
import { logger } from "./_logger.ts"

Effect.gen(function*() {
  yield* L.listen(logger)
  yield* L.system`
    Unless otherwise specified, do not ask follow-up questions; Always reply to the best of your ability using the information you have.
  `

  yield* L.user`Decide on a subtopic for us to discuss within the domain of technological futurism.`
  yield* L.assistant
  yield* L.user`Great, please teach something interesting about this choice of subtopic.`
  yield* L.assistant

  let i = 0
  while (i < 3) {
    yield* L.line(
      L.user`Please reply to the last message on my behalf.`,
      L.assistant,
    ).pipe(
      L.provide(
        L.branch,
      ),
      L.user,
    )
    yield* L.assistant
    i++
  }
  yield* L.user`Please summarize the key points from our conversation.`
  yield* L.assistant
}).pipe(
  L.provide(
    L.thread,
  ),
  Effect.scoped,
  Effect.provide(ModelLive),
  Effect.runFork,
)
