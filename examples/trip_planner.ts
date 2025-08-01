import { Terminal } from "@effect/platform"
import { BunTerminal } from "@effect/platform-bun"
import { Effect, Schema, Stream } from "effect"
import { L, Strand } from "liminal"
import { model } from "./_layers.ts"
import { logLEvent } from "./_logLEvent.ts"

const DEPARTURE_LOCATION = "New York City"

Effect.gen(function*() {
  yield* L.events.pipe(
    Stream.runForEach(logLEvent),
    Effect.fork,
  )

  yield* L.user`
    I want to plan a weekend trip leaving from ${DEPARTURE_LOCATION}. I don't know where to go.
    Suggest some follow-up questions that will help you narrow down the possible destination.
  `
  const { questions } = yield* L.assistantStruct({
    questions: Schema.Array(Schema.String),
  })
  yield* L.user`Here are my answers to those questions:`
  const terminal = yield* Terminal.Terminal
  for (const question of questions) {
    yield* terminal.display(question + "\n")
    const answer = yield* terminal.readLine
    yield* L.user`
      Question: ${question}
      Answer: ${answer}
    `
  }
  yield* L.user`Now that we've refined the destination criteria, please provide a single recommendation.`
  yield* L.assistant
  yield* L.user`Where can I stay there, what can I do there, how do I get there?`
  return yield* L.assistant
}).pipe(
  Effect.provide(Strand.new()),
  Effect.provide(model),
  Effect.provide(BunTerminal.layer),
  Effect.runPromise,
).then(console.log)
