---
title: Overview
---

# Liminal <Badge type="warning" text="beta" />

Liminal is a model-agnostic library for conversation state management.

```ts twoslash
import { z } from "zod"
// ---cut---
import { Exec, Inference, Model } from "liminal"

function* PlantGrowthRanking() {
  yield* Model.language("default")

  // User Message
  yield "What are some key factors that affect plant growth?"

  // Assistant Message
  const factors = yield* Inference()

  // User Message
  yield "Rank those by order of importance"

  // Assistant Message (structured output)
  const { ranking } = yield* Inference(z.object({
    ranking: z.string().array(),
  }))

  return ranking
}
```
