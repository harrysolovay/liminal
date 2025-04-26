# Liminal Declaration <Badge type="warning" text="beta" />

## AI SDK

```ts
import { openai } from "@ai-sdk/openai"
import { L } from "liminal"
import { ai } from "liminal-ai"

function* g() {
  yield* L.model(ai(openai("gpt-4o-mini")))
}
```

## Ollama

```ts
import { L } from "liminal"
import { ollama } from "liminal-ollama"

function* g() {
  yield* L.model(ollama("gemma3:1b"))
}
```

## Create Adapter

TODO
