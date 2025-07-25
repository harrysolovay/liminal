# Overview <Badge type="warning" text="beta" />

> Liminal is in active development.

<!-- > See
> [the roadmap](https://github.com/harrysolovay/liminal/issues/319) for more
> information. -->

Liminal provides building blocks for LLM-guided workflows with
[Effect](https://effect.website/).

When using Liminal, **conversation definitions are expressed as effects.** When
we execute these effects, the fiber runtime manages underlying state such as the
list of messages.

We reason about control flow and narrative development as one.

```ts
import { Effect } from "effect"
import { L, Strand } from "liminal"

const program = Effect
  .gen(function*() {
    // Append a user message.
    yield* L.user`Where is the pot of gold?`

    // Infer and append a model reply.
    const reply = yield* L.assistant()

    // The conversation culminates in a string.
    return reply
  })
  .pipe(Effect.provide(Strand.layer({
    system: `You are a Leprechaun.`,
  })))
```

## State Management

With every yield, Liminal updates the underlying conversation state. The final
conversation may look as follows (but as an `@effect/ai` `AiInput.Message`).

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

## Pure Composition

JavaScript iterables can be recursively spread into one another. This lets us
express child workflows purely.

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
import { Effect } from "effect"
import { L } from "liminal"

export const refine = (content: string, i = 5) =>
  Effect.gen(function*() {
    while (i-- > 0) {
      yield* L.user`Improve the following text: ${content}`
      content = yield* L.assistant()
    }
    return content
  })
```

## Pattern-Sharing

Share your patterns with the world.

```ts {1,10}
import { Effect } from "effect"
import { L } from "liminal"
import { refine } from "liminal-definitions"

const maybeRefine = (initial: string) =>
  Effect.gen(function*() {
    yield* L.user`Does the following text require refinement?: ${initial}`

    const { needsRefinement } = yield* L.assistant(Schema.Struct({
      needsRefinement: Schema.Boolean,
    }))
    if (needsRefinement) {
      return yield* refine(initial)
    }
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

  const result = yield* L.assistant(Schema.Struct({
    month: L.integer,
    day: L.integer,
  }))

  result satisfies { month: integer; day: number }
})
```

## Next Steps

In the next section we cover Liminal's installation and a basic example of its
usage.
