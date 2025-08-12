import { Effect } from "effect"
import { L } from "liminal"
import { ModelLive } from "./_layers.ts"
import { logger } from "./_logger.ts"

// TODO: common system message parts for desirable behavior such as not asking for follow up questions.

Effect.gen(function*() {
  yield* logger

  yield* L.sequence(
    L.system`
      When an instruction is given, don't ask any follow-up questions.
      Just reply to the best of your ability given the information you have.
    `,
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
  L.root,
  Effect.scoped,
  Effect.provide(ModelLive),
  Effect.runFork,
)
