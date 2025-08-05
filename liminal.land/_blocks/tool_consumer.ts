import { Effect } from "effect"
import { L } from "liminal"

// ---cut---
import { DadJokeTools } from "./DadJokeTools.ts"
import { ModelLive } from "./ModelLive.ts"

// Implement the `GetDadJoke` handler.
const HandlerLive = DadJokeTools.toLayer(Effect.gen(function*() {
  return {
    GetDadJoke: Effect.fn(function*() {
      return "Delish pish decaly dish!"
    }),
  }
}))

Effect.gen(function*() {
  // Enable the tool.
  yield* L.enable(DadJokeTools)

  // Converse. The model will use the tool as it sees fit.
  yield* L.user`Generate a dad joke about pirates.`
  const reply = yield* L.assistant
  reply satisfies string
}).pipe(
  L.strand,
  Effect.provide([ModelLive, HandlerLive]),
  Effect.runFork,
)
