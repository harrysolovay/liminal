---
title: Overview
---

# Liminal <Badge type="warning" text="beta" />

Liminal is a model-agnostic library for conversation state management.

```ts twoslash
import { z } from "zod"
// ---cut---
import { DeclareModel, Exec, Infer } from "liminal"

function* PlantGrowthRanking() {
  yield* DeclareModel.language("default")

  // User Message
  yield "What are some key factors that affect plant growth?"

  // Assistant Message
  const factors = yield* Infer()

  // User Message
  yield "Rank those by order of importance"

  // Assistant Message (structured output)
  const { ranking } = yield* Infer(z.object({
    ranking: z.string().array(),
  }))

  return ranking
}
```
