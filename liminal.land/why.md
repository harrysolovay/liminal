# Why? <Badge type="warning" text="beta" />

## Conversation-Modeling

Liminal provides generic building blocks for modeling conversations and
interacting with language models. The conversation state is abstracted into
ordinary function control flow. This enables us to reason about control flow and
narrative progression as one.

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

### State Management

With each yield, Liminal updates the underlying conversation state. The final
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

### Conversation Runtime

Liminal manages conversation-related state such as message lists, language model
stacks and registered tools, so that you can focus on evolving your context and
other core functionality.

```ts
const value = await L.strand(g)
```

## Standard JavaScript

They are defined with JavaScript iterables (in this case a generator function).
They can trigger arbitrary computations, such as loops and promise execution.

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

Because strands are made from iterators, it's easy to create and reuse patterns
such as iterative refinement loops.

```ts
function* refine(content: string, i = 5) {
  while (i-- > 0) {
    yield* L.user`Improve the following text: ${content}`
    content = yield* L.inference
  }
  return content
}
```

We can reuse these conversation components, enabling us to compose higher-level
conversations.

```ts {5}
function* maybeRefine(content: string) {
  yield* L.user`Does the following text require refinement?: ${content}`
  const shouldRefine = yield* L.boolean
  if (shouldRefine) {
    return yield* refine(initial)
  }
  return content
}
```

## Model Selection

Focus a model anytime with `L.model`. The specified model adapter will be used
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

## Strands

Strands are conversation isolates.

```ts
function* g(content: string) {
  yield* L.user`Ask me a question about language models.`
  yield* L.assistant

  const answer = yield* L.strand(function*() {
    // Has no affect on the conversation underlying `g`.
    yield* L.user`Reply to this question on my behalf.`
    return yield* L.assistant
  })

  // Respond (from the user) with `answer` in the conversation underlying `g`.
  yield* L.user(answer)

  // ...
}
```

## Parallelization

Each of the following strands has their own isolated copy of the outer's state.

```ts
function* g() {
  yield* L.user`It's halloween night!`

  const results = yield* L.strand({
    *trick() {
      yield* L.system`You're a prankster.`
      yield* L.user`What are some good pranks?`
      return yield* L.assistant
    },
    *treat() {
      yield* L.system`You love sugar!`
      yield* L.user`How to get the most candy possible?`
      return yield* L.assistant
    },
  })

  results satisfies {
    trick: string
    treat: string
  }
}
```

### Coding Agents Meeting Liminal

Liminal conversations are composed with JavaScript iterators, which can be
recursively spread into one another. This construct helps us express subsystems
and conversation patterns purely.

```ts
function* a() {
  yield* L.user`Hi from a.`
  return yield* b()
}

function* b() {
  yield* L.user`Hi from b.`
  return "Hi!"
}
```

### Self-Reflection

We can create high-level conversation patterns for self-reflection.

```ts
async function* g() {
  yield* L.system`
    You are a custom support agent responsible for determining whether
    a given message needs to be escalated to a human for review.
  `

  // Example function dynamically retrieves hypothetical customer support messages.
  const messages = await getCustomerSupportMessages()

  const escalations = yield* L.strand(
    messages.map(function*({ messageId, message }) {
      yield* L.user`
        Does the following customer message merit
        a human reviewer giving it attention?:
        ---
        ${message}
      `
      return {
        messageId,
        requiresEscalation: yield* L.boolean,
      }
    }),
  )

  result satisfies Array<{
    messageId: string
    requiresEscalation: boolean
  }>
}
```

## Structured Output

Use your runtime type library of choice to ensure inference conforms to the
specified shape.

```ts
import { compile } from "liminal-zod"
import { z } from "zod"

// Get/ensure an LLM-optimized subset of JSON schema.
const MyType = compile(
  z.object({ a: z.string, b: z.number }),
)

function* g() {
  const result = yield* L.assistant(MyType)

  result satisfies { a: string; b: number }
}
```

## Observability

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
```

## Next Steps

In the next section we cover Liminal's installation and a basic example of its
usage.
