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

  // Infer and append a reply.
  yield* L.assistant
}
```

With each yield, Liminal updates the underlying conversation state. The final of
the example above looks as follows.

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
    "content": "..."
  }
]
```

## Pure Composition

Because agents are made from iterator protocol objects, it's easy to create and
reuse patterns such as iterative refinement loops.

```ts
function* refine(content: string) {
  let i = 0
  while (i < 5) {
    yield* L.user`Improve the following text: ${content}`
    content = yield* L.reply
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

Liminal streamlines conversational branching, allowing us to explore alternative
conversation states and compute results.

Let's modify the example above to isolate the refinement loop from the outer
conversation (`g`).

```ts
function* g() {
  const initial = await prompt("Please provide some text.")!
  const refined = yield* L.branch(refine(initial))
  return refined
}
```

## Parallel Agents

We can execute parallel branches, each with their own isolated copy of the outer
conversation.

```ts
function* g() {
  yield* L.user`A message, soon to be inherited by refiners.`

  const refined = yield* L.branch(values.map(refine))

  refined satisfies Array<string>
}
```

### Convenient APIs

Branch definitions can take the form of iterables, iterable-producing (nullary)
functions and records of the aforementioned values.

```ts
function* g() {
  yield* L.user`...`

  const result = yield* L.branch({
    a: refined(text),
    *b() {
      yield* L.user`...`
      return "A"
    },
  })

  result satisfies {
    a: string
    b: string
  }
}
```

## Structured Output

Liminal allows you to use various runtime type libraries to ensure assistant
replies conform to a specified shape.

> [!TIP]
> Supported libraries include zod, arktype, effect/schema, typebox and

```ts
import { compile } from "liminal-zod"
import { z } from "zod"

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

## Model-switching

Switch the model anytime by yielding it. After being yielded, the model will be
used for subsequent inference.

```ts
import { models } from "./models.ts"

function* g() {
  yield* L.user`Message A.`
  yield* L.model(models.default)
  yield* L.infer

  yield* L.user`Message B.`
  yield* L.model(models.reasoning)
  yield* L.infer
}
```

## Standard JavaScript

Liminal agents are defined as JavaScript iterables. These iterables can trigger
arbitrary computations, such as looping and promise execution.

```ts
async function* g() {
  yield* L.system`...`

  while (Math.random() < .9) {
    yield* L.assistant
  }

  const item = await db.getItem()
}
```

## Observability

Agents definitions can yield events. We can listen to these events during the
agent's runtime.

```ts
await Agent(
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
