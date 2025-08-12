import { Effect } from "effect"

declare const conversation: Effect.Effect<void>

// ---cut---
import { Thread } from "liminal"

const StrandLive = Thread.layer()

conversation.pipe(
  Effect.provide(StrandLive),
)
