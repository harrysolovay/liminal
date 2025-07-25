import { Terminal } from "@effect/platform"
import { BunTerminal } from "@effect/platform-bun"
import * as Console from "effect/Console"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import { L, Strand } from "liminal"
import { common } from "./_common.ts"

const DEPARTURE_LOCATION = "New York City"

await Effect.gen(function*() {
  yield* L.user`
    I want to plan a weekend trip leaving from ${DEPARTURE_LOCATION}. I don't know where to go.
    Suggest some follow-up questions that will help you narrow down the possible destination.
  `
  const { questions } = yield* L.assistant(Schema.Struct({
    questions: Schema.Array(Schema.String),
  }))
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
  yield* L.assistant()
  yield* L.user`Where can I stay there, what can I do there, how do I get there?`
  return yield* L.assistant()
}).pipe(
  Effect.provide(Strand.layer({
    onMessage: Console.log,
  })),
  common,
  Effect.provide(BunTerminal.layer),
  Effect.runPromise,
).then(console.log)
