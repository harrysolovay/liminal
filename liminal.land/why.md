# Why Liminal? <Badge type="warning" text="beta" />

## Agent Definition

Liminal provides model-agnostic building blocks that describe the behavior of
agents. For example:

```ts
// Change the current model mid-conversation.
L.model("key")

// Append a user message to the message buffer.
L.user`User message here.`

// Trigger a completion.
L.reply
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

  // Get a reply from the model, append as an assistant message.
  const answer = yield* L.reply
}
```

When executed, the resulting message state will look similar to the following.

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
  yield* L.model("initial")
  yield* L.infer
  yield* L.model("mini")
  yield* L.infer
  yield* L.model("reasoning")
  yield* L.infer
}
```

Only upon execution do we bind models to these keys.

```ts
declare const initial: LanguageModel
declare const mini: LanguageModel
declare const reasoning: LanguageModel

const result = await exec(g, {
  initial,
  mini,
  reasoning,
})
```

## Standard JavaScript

Liminal agents are JavaScript objects that implement the iterator protocol (such
as arrays, iterators and generators).

Iterating can trigger ordinary JavaScript code, such as while loops and promise
execution.

```ts
async function* g() {
  yield* L.system`...`

  const item = await db.getItem()

  while (Math.random() < .9) {
    yield* L.reply
  }

  // ...
}
```

## Agent Composition

Because agents are mere iterator protocol objects, it's easy to create and reuse
patterns such as iterative refinement loops.

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

## Structured Output

Liminal allows you to use various [standard schema](https://standardschema.dev/)
types to ensure replies conform to the specified shape.

> [!TIP]
> Supported libraries include zod, arktype, effect/schema, typebox and
> [Liminal runtime types](./liminal_types/preface.md).

```ts
import { z } from "zod"

function* g() {
  const result = yield* L.reply(
    z.object({
      value: z.string,
    }),
  )

  result satisfies {
    value: string
  }
}
```

## Observability

Within agents, we can yield events that contain arbitrary data. This enables us
to then listen for those events during the agent's runtime.

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

  // Does not have the message yielded in agent `a` nor `b`.
}
```

## Next Steps

In the next section we cover Liminal's installation and a basic example of its
usage.
