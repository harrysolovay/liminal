# Overview <Badge type="warning" text="beta" />

Liminal provides building effects for managing LLM-powered conversations with
[Effect](https://effect.website/).

When using Liminal, **conversation definitions are expressed as effects.** When
we execute these effects, the fiber runtime manages underlying state such as the
list of messages.

We reason about control flow and conversation as one.

```ts
import { Effect } from "effect"
import { L } from "liminal"

const conversation = Effect.gen(function*() {
  // Append a user message.
  yield* L.user`Where is the pot of gold?`

  // Infer and append an assistant message.
  const loc = yield* L.assistant

  // Use the reply.
  loc satisfies string
})
```

## State Management

With every `yield*`, Liminal updates the underlying conversation state. The
final conversation may look as follows.

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

## Reusable Patterns

Express reusable conversational patterns, such as iterative refinement loops.

```ts
import { Effect } from "effect"
import { L } from "liminal"

export const refine = Effect.fn(function*(content: string, i = 5) {
  // For `i` iterations.
  while (i-- > 0) {
    // Append a message asking for the refinement.
    yield* L.user`Refine the following text: ${content}`
    // Infer and reassign `content` to an assistant message.
    content = yield* L.assistant
  }
  // Return the `i`th `content`.
  return content
})
```

## Pattern Libraries

Share your conversational patterns with the world.

```ts {3,15}
import { Effect } from "effect"
import { L } from "liminal"
import { refine } from "liminal-foo"

const maybeRefine = Effect.fn(function*(content: string) {
  // Ask whether to utilize the pattern.
  yield* L.user`Does the following text require refinement?: ${content}`
  // Have the model answer our question.
  const { needsRefinement } = yield* L.assistantStruct({
    needsRefinement: Schema.Boolean,
  })
  // If so...
  if (needsRefinement) {
    // Refine and return.
    return yield* refine(content)
  }
  // Otherwise, return the initial content.
  return content
})
```

## Structured Output

Use Effect Schema to describe structured output requirements.

```ts {7-10}
import { Effect, Schema } from "effect"
import { L } from "liminal"

Effect.gen(function*() {
  yield* L.user`What day of the year is halloween?`

  const result = yield* L.assistantStruct(
    Schema.Struct({
      month: L.integer,
      day: L.integer,
    }),
  )

  result satisfies { month: integer; day: number }
})
```

## Next Steps

In the next section we cover Liminal's installation and a basic example of its
usage.
