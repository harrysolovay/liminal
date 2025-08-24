import { Terminal } from "@effect/platform"
import { BunTerminal } from "@effect/platform-bun"
import { Effect, Schema } from "effect"
import { L } from "liminal"
import { ModelLive } from "./_layers.ts"
import { logger } from "./_logger.ts"

Effect.gen(function*() {
  yield* L.listen(logger)

  const term = yield* Terminal.Terminal
  yield* term.display("From which city are you departing?\n")
  yield* L.user`
    I want to plan a weekend trip leaving from ${term.readLine}. I don't know where to go.
    Suggest some follow-up questions that will help you narrow down the possible destination.
  `
  const questions = yield* L.assistantSchema(Schema.Array(Schema.String))
  yield* L.user`Here are my answers to those questions:`
  for (const question of questions) {
    yield* term.display(question + "\n")
    yield* L.user`
      Question: ${question}
      Answer: ${term.readLine}
    `
  }
  yield* L.user`Now that we've refined the destination criteria, please provide a single recommendation.`
  yield* L.assistant
  yield* L.user`Where can I stay there, what can I do there, how do I get there?`
  return yield* L.assistant
}).pipe(
  L.provide(
    L.thread,
  ),
  Effect.scoped,
  Effect.provide([ModelLive, BunTerminal.layer]),
  Effect.runFork,
)
