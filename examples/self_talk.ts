import { Effect } from "effect"
import { L } from "liminal"
import { model } from "./_layers.ts"
import { logger } from "./_logger.ts"

Effect.gen(function*() {
  yield* logger

  yield* L.system`
    When an instruction is given, don't ask any follow-up questions.
    Just reply to the best of your ability given the information you have.
  `

  yield* L.user`Decide on a subtopic for us to discuss within the domain of technological futurism.`
  yield* L.assistant
  yield* L.user`Great, please teach something interesting about this choice of subtopic.`
  yield* L.assistant
  let i = 0
  while (i < 3) {
    const reply = yield* L.strand(
      L.user`Please reply to the last message on my behalf.`,
      L.assistant,
    )
    yield* L.user(reply)
    yield* L.assistant
    i++
  }
  yield* L.user`Please summarize the key points from our conversation.`
  return yield* L.assistant
}).pipe(
  L.strand,
  Effect.provide(model),
  Effect.runPromise,
)
