# What is Liminal?

## Agent Definition

Liminal provides model-agnostic building blocks that describe the behavior of
agents. For example:

```ts
// Change the current model mid-conversation.
L.model("key")

// Trigger a completion.
L.infer

// Get a vector embedding.
L.embed(value)
```

## Conversation Management

As we yield these building blocks, Liminal maintains an underlying conversation.
This allows us to reason about the progression of the conversation as part of
standard function control flow.

```ts
function* agent() {
  // Append a system message.
  yield* L.system`Be very specific.`

  // Append a user message.
  yield* L.user`Answer my question.`

  // Get a completion, append as an assistant message.
  const answer = yield* L.infer
}
```

```json
[
  {
    "role": "system",
    "content": "Be very specific."
  },
  {
    "role": "user",
    "content": "Answer my question."
  },
  {
    "role": "assistant",
    "content": "..."
  }
]
```

## Model Interoperability

Models are never hard-coded into Liminal agents. Instead, we specify keys.

```ts
function* g() {
  yield* L.infer
  yield* L.model("mini")
  yield* L.infer
  yield* L.model("reasoning")
  yield* L.infer
}
```

Only upon execution do we mind a model to these keys.

```ts
declare const modelA: LanguageModel
declare const modelB: LanguageModel
declare const modelC: LanguageModel

exec(g, {
  default: modelA,
  apply: {
    mini: modelB,
    reasoning: modelC,
  },
})
```

## Standard JavaScript

Liminal agents are standard JavaScript objects that implement the iterator
protocol (arrays, iterators, iterables, generators).

Iterating can trigger ordinary JavaScript code, such as while loops and promise
execution.

```ts
async function* g() {
  yield* L.system`...`

  const item = await db.getItem()

  while (Math.random() < .9) {
    yield* L.infer
  }

  // ...
}
```

## Agent Composition

Create and reuse patterns such as iterative refinement loops.

```ts
function* refine(input: string) {
  let i = 0
  let current = input
  while (i < 5) {
    yield* L.user`Improve the following text: ${current}`
    current = yield* L.infer
  }
  return current
}
```

## Structured Output

Liminal allows you to yield various
[standard schema](https://standardschema.dev/) runtime types to get completions
as typed structured output.

> [!TIP]
> Supported libraries include zod, arktype, effect/schema, typebox and
> [Liminal runtime types](./runtime_types/index.md).

```ts
import { z } from "zod"

function* g() {
  const value = yield* z.object({
    first: L.string,
    second: L.string,
  })

  value satisfies {
    first: string
    second: string
  }
}
```

## Runtime

We pass the Agent (a JavaScript iterator protocol objects) to `exec`, which runs
it and returns the final value if any.

```ts
await exec(g, {
  default: defaultModel,
})

declare const defaultModel: LanguageModel
```

## Observability

Within agents, we can emit events that contain arbitrary data. This enables us
to then listen for those events throughout agent execution.

```ts
function* g() {
  yield* L.event("event-name-here")
}

exec(g, {
  // ...
  handler(event) {
    if (event === "event-name-here") {
      // ...
    }
  },
})
```

## Agent Hierarchies

Liminal simplifies conversational branching and parallel agents.

Any agent can branch into child agents, each with their own isolated copy of the
parent state.

```ts
function* g() {
  yield* L.user`Shared message.`

  yield* L.branch({
    *a() {
      // Has `Shared Message.`
      yield* L.user`Child agent A.`
    },
    *b() {
      // Has `Shared Message.`
      yield* L.user`Child agent B`
    },
  })
}
```
