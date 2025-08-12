import { Effect } from "effect"
import { L } from "liminal"
import { ModelLive } from "./_layers.ts"
import { logger } from "./_logger.ts"

Effect.gen(function*() {
  yield* logger

  yield* L.system`
    Write persuasive marketing copy for: Buffy The Vampire Slayer.
    Focus on benefits and emotional appeal.
  `
  yield* L.user`I'm feeling the following three emotions:`
  yield* L.user`Elated to be building Liminal.`
  yield* L.user`Curious whether the mental model fits.`
  yield* L.user`Chilled out, because it's all for enjoyment.`
  yield* L.user`What are your thoughts on the matter?`
  yield* L.assistant
  yield* L.user`Any advice for me as I further-explore this project?`
  yield* L.assistant

  const summary = yield* L.scoped(
    L.user`Please summarize our conversation.`,
    L.assistant,
  )
  yield* L.clear
  yield* L.user`Let's resume our discussion from the following summary: ${summary}`

  yield* L.user`So please reiterate your thoughts on this creative journey.`
  yield* L.assistant
}).pipe(
  L.scoped,
  Effect.scoped,
  Effect.provide(ModelLive),
  Effect.runFork,
)
