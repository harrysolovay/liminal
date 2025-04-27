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

## OpenAI

```ts
import { L } from "liminal"
import { ollama } from "liminal-openai"

function* g() {
  yield* L.model(openai("gpt-4o-mini"))
}
```

## Creating Adapters

```ts
import { Model } from "liminal"
import { type Message, Ollama } from "ollama"

// Up to you. Could be a union of model name literals.
type YourConfig = any

export function adapter(config: YourConfig): Model {
  return new Model(
    "your_vendor_name",
    ({ messages, schema }) => {
      return {
        resolve() {
          // Request inference from model.
          // Return the inferred value.
        },
        stream() {
          // Request inference from model with streaming enabled.
          // Return a ReadableStream<string>
        },
      }
    },
  )
}
```
