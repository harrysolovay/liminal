# Why Liminal? <Badge type="warning" text="beta" />

## Conversation-Modeling

Liminal provides building blocks for modeling conversations as part of ordinary
function control flow.

```ts
function* g() {
  // Append a system message.
  yield* L.system`
    You are a Leprechaun.
  `

  // Append a user message.
  yield* L.user`
    Where is the pot of gold?
  `

  // Infer and append a model reply.
  yield* L.assistant
}
```

With each yield, Liminal updates the underlying conversation state. The final
conversation looks as follows.

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

Because strands are made from iterator protocol objects, it's easy to create and
reuse patterns such as iterative refinement loops.

```ts
function* refine(content: string) {
  let i = 0
  while (i < 5) {
    yield* L.user`Improve the following text: ${content}`
    content = yield* L.inference
  }
  return content
}
```

Later on we can use this conversation with ease.

```ts {4}
function* g() {
  const initial = await prompt("Please provide some text.")!
  const refined = yield* refine(initial)
  return refined
}
```

## Branching

Branch conversations and explore their alternative states and return values. The
child conversation won't affect the parent conversation (`g`).

```ts
function* g() {
  const initial = await prompt("Please provide some text.")!
  const refined = yield* L.branch(refine(initial))
  return refined
}
```

## Parallel Strands

Branching is one means by which we can create parallel strands. Each of the
following strands has their own isolated copy of the outer conversation.

```ts
function* g() {
  yield* L.user`A message, soon to be inherited by refiners.`

  const results = yield* L.strand(values.map(refine))

  results satisfies Array<string>
}
```

### Expressive Branching

Branch definitions can take the form of iterables, iterable-producing functions
and records of those values.

```ts
function* g() {
  yield* L.user`...`

  const result = yield* L.strand({
    *a() {
      yield* L.user`...`
      return "A"
    },
    *b() {
      yield* L.user`...`
      return "B"
    },
  })

  result satisfies {
    a: string
    b: string
  }
}
```

## Structured Output

Use runtime types as structured output schema.

```ts
import { compile } from "liminal-zod"
import { z } from "zod"

// Get an LLM-optimized subset of JSON schema.
const MyType = compile(z.object({
  a: z.string,
  b: z.number,
}))

function* g() {
  const result = yield* L.assistant(MyType)

  result satisfies {
    a: string
    b: number
  }
}
```

> See integration guide for [`arktype`](./schema.md), [`valibot`](./schema.md),
> [`typebox`](./schema.md) and [`effect/Schema`](./schema.md).

## Model Selection

Focus a model anytime by yielding it. The model will be used for subsequent
inference.

```ts
import { openai } from "@ai-sdk/openai"
import { ai } from "liminal-ai"

function* g() {
  yield* L.model(ai(openai("gpt-4o-mini")))
  yield* L.infer
  yield* L.model(ai(openai("o4-mini-high")))
  yield* L.infer
}
```

## Standard JavaScript

Liminal strands are defined as JavaScript iterables. These iterables can trigger
arbitrary computations, such as loops and promise execution.

```ts {4,8}
async function* g() {
  yield* L.system`...`

  while (Math.random() < .9) {
    yield* L.assistant
  }

  const item = await db.getItem()
}
```

## Observability

Strand definitions can yield events. We can listen to these events at runtime.

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
```

## Next Steps

In the next section we cover Liminal's installation and a basic example of its
usage.
