---
prev: false
---

# Liminal Overview <Badge type="warning" text="beta" />

**Liminal enables the expression of reusable conversations as
[effects](/effects.md).**

```ts twoslash
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

This allows us to reason about the progression of the conversation with ordinary
function control flow.

```ts twoslash
declare const condition: boolean
import { Effect, Schema } from "effect"
import { L } from "liminal"
// ---cut---
Effect.gen(function*() {
  while (true) {
    // Ask the assistant whether to move on.
    yield* L.user`Are we done with this part of the conversation?`
    const { finished } = yield* L.assistantStruct({
      finished: Schema.Boolean,
    })

    // If finished, move onto the next part of the conversation.
    if (finished) break
  }
  // The conversation continues...
})
```

## State Management

With every `yield*`, Liminal updates the underlying conversation state. The
final conversation of the first example may look as follows.

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

Liminal effects are reusable conversational patterns. For example, we can
express an iterative refinement loop as follows.

```ts twoslash
import { Effect } from "effect"
import { L } from "liminal"

export const refine = Effect.fnUntraced(function*(content: string) {
  // For 5 iterations.
  for (let i = 0; i < 5; i++) {
    // Append a message asking for the refinement.
    yield* L.user`Refine the following text: ${content}`
    // Infer and reassign `content` to an assistant message.
    content = yield* L.assistant
  }
  // Return the final `content`.
  return content
})
```

We can share and consumed this pattern––or any Liminal effect––as we would any
other JavaScript library.

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

---

In the next section we cover Liminal's installation and a basic example of its
usage.
