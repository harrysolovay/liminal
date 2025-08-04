import { Effect } from "effect"

declare const conversation: Effect.Effect<void>

// ---cut---
import { Strand } from "liminal"

const StrandLive = Strand.layer()

conversation.pipe(
  Effect.provide(StrandLive),
)
