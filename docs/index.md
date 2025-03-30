---
title: Overview
---

# Liminal <Badge type="warning" text="beta" />

Liminal is a model-agnostic library for conversation state management.

```ts twoslash
import { z } from "zod"
// ---cut---
import { Conversation, Inference, Model } from "liminal"

function* PlantGrowthRanking() {
  // Describe the requirement of a language model by the key of `"default"`.
  yield* Model.language("default")

  // Buffer a user message.
  yield "What are some key factors that affect plant growth?"

  // Complete text and add it (as an assistant message) to the buffer.
  const factors = yield* Inference()

  // Buffer another user message.
  yield "Rank those by order of importance"

  // Same as before, but this time with a `ZodType` (could use another Standard Schema type).
  const { ranking } = yield* Inference(z.object({
    ranking: z.string().array(),
  }))

  // Return a result from the conversation.
  return ranking
}
```
