# Overview <Badge type="warning" text="beta" />

Liminal provides building blocks for modeling conversations between language
models.

**Conversation definitions are expressed as generator functions.** When we run
these definitions, Liminal manages underlying state such as the list of
messages.

**We reason about function control flow and narrative development as one.**

```ts
import { L } from "liminal"

function* g() {
  // Append a system message.
  yield* L.system`You are a Leprechaun.`

  // Append a user message.
  yield* L.user`Where is the pot of gold?`

  // Infer and append a model reply.
  const inference = yield* L.assistant

  // The conversation culminates in a string.
  return inference
}
```

## State Management

With every yield, Liminal updates the underlying conversation state. The final
conversation may look as follows.

```json
[
  {
    "role": "system",
    "content": "You are a Leprechaun."
  },
  {
    "role": "user",
    "content": "Where is the pot of gold?"
  },
  {
    "role": "assistant",
    "content": "Under the rainbow."
  }
]
```

## Standard JavaScript

Conversation definitions can trigger arbitrary computations, such as loops and
database queries. There are no cumbersome workflow abstractions like with Mastra
or LangGraph.js.

```ts {4,8}
async function* g() {
  yield* L.system`...`

  while (Math.random() < .9) {
    yield* L.assistant
  }

  const item = await db.getItem()

  yield L.user`The retrieved item: ${item}`
}
```

## Pure Composition

JavaScript iterables can be recursively spread into one another. This lets us
express subsystems purely.

```ts {7}
function* a() {
  yield* L.user`A`
}

function* b() {
  yield* L.user`B`
  yield* a()
}
```

## Reusable Patterns

Create reusable patterns such as iterative refinement loops.

```ts
function* refine(content: string, i = 5) {
  while (i-- > 0) {
    yield* L.user`Improve the following text: ${content}`
    content = yield* L.inference
  }
  return content
}
```

## Pattern-Sharing

Share your patterns with the world.

```ts {1,6}
import { refine } from "liminal-definitions"

function* maybeRefine(initial: string) {
  yield* L.user`Does the following text require refinement?: ${initial}`

  if (yield* L.assistant(L.boolean)) {
    return yield* refine(initial)
  }
  return content
}
```

## Structured Output

Use your runtime type library of choice to ensure inference conforms to the
specified shape.

```ts
function* g() {
  yield* L.user`What day of the year is halloween?`

  const result = yield* L.assistant(
    L.object({
      month: L.integer,
      day: L.integer,
    }),
  )

  result satisfies { month: integer; day: number }
}
```

<!-- ## Observability

Yield event "runes." Then listen to for your events at runtime.

```ts
await L.strand(
  function*() {
    yield* L.event("event-name-here")
  },
  {
    handler(event) {
      if (event === "event-name-here") {
        // ...
      }
    },
  },
)
``` -->

## Next Steps

In the next section we cover Liminal's installation and a basic example of its
usage.
