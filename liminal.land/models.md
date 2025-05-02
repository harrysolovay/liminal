# Liminal Models <Badge type="warning" text="beta" />

Focus a model anytime with `L.model`. The specified client adapter will be used
for subsequent inference.

```ts
import { openai } from "liminal-openai"

function* g() {
  yield* L.model(openai("gpt-4o-mini"))
  yield* L.infer // uses 4o mini
  yield* L.model(openai("o4-mini-high"))
  yield* L.infer // uses 4o mini high
}
```

## AI SDK Integration

```ts
import { openai } from "@ai-sdk/openai"
import { L } from "liminal"
import { ai } from "liminal-ai"

function* g() {
  yield* L.model(ai(openai("gpt-4o-mini")))
}
```

## Ollama Integration

```ts
import { L } from "liminal"
import { ollama } from "liminal-ollama"

function* g() {
  yield* L.model(ollama("gemma3:1b"))
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
    "your_client_name",
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
