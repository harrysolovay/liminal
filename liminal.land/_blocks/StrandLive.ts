import { Effect, Layer, Option, PubSub } from "effect"
import { type LEvent, Strand } from "liminal"

declare const conversation: Effect.Effect<void>

// ---cut---
const StrandLive = Layer.effect(
  Strand,
  Effect.gen(function*() {
    return Strand.of({
      parent: yield* Effect.serviceOption(Strand),
      events: yield* PubSub.unbounded<LEvent>(),
      system: Option.none(),
      messages: [],
      tools: new Set(),
    })
  }),
)

conversation.pipe(
  Effect.provide(StrandLive),
)
