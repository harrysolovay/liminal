import { Terminal } from "@effect/platform"
import { BunTerminal } from "@effect/platform-bun"
import { Effect, Stream } from "effect"
import { L } from "liminal"
import { ModelLive } from "./_layers.ts"

Effect.gen(function*() {
  const term = yield* Terminal.Terminal
  yield* L.user`How are you today?`
  yield* L.assistantStream.pipe(
    Stream.runForEach(({ text }) => term.display(text)),
    Effect.forkDaemon,
  )
}).pipe(
  L.scoped,
  Effect.provide([BunTerminal.layer, ModelLive]),
  Effect.runFork,
)
