import * as Console from "effect/Console"
import * as Effect from "effect/Effect"
import { L, Strand } from "liminal"
import { common } from "./_common.ts"

await Effect
  .gen(function*() {
    yield* L.user`Decide on a subtopic for us to discuss within the domain of technological futurism.`
    yield* L.assistantText
    yield* L.user`Great, please teach something interesting about this choice of subtopic.`
    yield* L.assistantText
    let i = 0
    while (i < 3) {
      const reply = yield* Effect
        .gen(function*() {
          yield* L.user`Please reply to the last message on my behalf.`
          return yield* L.assistantText
        })
        .pipe(Effect.provide(Strand.layer()))
      yield* L.user(reply)
      yield* L.assistantText
      i++
    }
    yield* L.user`Please summarize the key points from our conversation.`
    return yield* L.assistantText
  })
  .pipe(
    Effect.provide(Strand.layer({
      system: `
        When an instruction is given, don't ask any follow-up questions.
        Just reply to the best of your ability given the information you have.
      `,
      onMessage: Console.log,
    })),
    common,
    Effect.runPromise,
  )
  .then(console.log)
