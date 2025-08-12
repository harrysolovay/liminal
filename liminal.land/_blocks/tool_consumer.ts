import { Effect } from "effect"
import { L } from "liminal"

// ---cut---
import { AiToolkit } from "@effect/ai"
import { DadJokeTool } from "./DadJokeTools.ts"
import { ModelLive } from "./ModelLive.ts"

// Implement the `GetDadJoke` handler.
const HandlerLive = AiToolkit.make(DadJokeTool).toLayer(Effect.gen(function*() {
  return {
    GetDadJoke: Effect.fn(function*() {
      return "Delish pish decaly dish!"
    }),
  }
}))

Effect.gen(function*() {
  // Enable the tool.
  yield* L.enable(DadJokeTool)

  // Converse. The model will use the tool as it sees fit.
  yield* L.user`Generate a dad joke about pirates.`
  const reply = yield* L.assistant
  reply satisfies string
}).pipe(
  L.root,
  Effect.provide([ModelLive, HandlerLive]),
  Effect.runFork,
)
