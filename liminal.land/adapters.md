# Liminal (Model) Adapters <Badge type="warning" text="beta" />

Focus a model adapter with `L.focus`. The specified client adapter will be used
for subsequent inference.

## AI SDK Integration

```ts
import { openai } from "@ai-sdk/openai"
import { L } from "liminal"
import { ai } from "liminal-ai"

function* g() {
  yield* L.focus(ai(openai("gpt-4o-mini")))
}
```

## Ollama Integration

```ts
import { L } from "liminal"
import { ollama } from "liminal-ollama"

function* g() {
  yield* L.focus(ollama("gemma3:1b"))
}
```

## Switch Models

```ts
import { adapter } from "liminal-ollama"

function* g() {
  yield* L.focus(adapter("gpt-4o-mini"))
  yield* L.assistant // uses 4o mini
  yield* L.focus(adapter("o4-mini-high"))
  yield* L.assistant // uses 4o mini high
}
```

## Creating Adapters

```ts
import { Adapter } from "liminal"
import { type Message, Ollama } from "ollama"

// Up to you. Could be a union of model name literals.
type YourConfig = any

export function adapter(config: YourConfig): Adapter {
  return new Adapter(
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
