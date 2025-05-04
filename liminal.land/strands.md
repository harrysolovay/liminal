# Liminal Strands <Badge type="warning" text="beta" />

A "strand" is a conversation isolate. Each strand has its own registry of
messages, models, tools and other locals. We define strands as generator
functions.

```ts
function* g() {
  // Add a user message.
  yield* L.user`Parent`

  // Branch the conversation.
  yield* L.strand(function*() {
    // Add a user message.
    // Isolated from parent conversation.
    yield* L.user`Child.`
  })

  // unaffected
}
```

## Runes

We yield "Runes" which instruct Liminal how to manage the conversation state and
interact with language models.

```ts twoslash
import { Adapter, L } from "liminal"
declare const adapter: Adapter

// ---cut---
function* g() {
  yield* L.focus(adapter)

  // For appending a user-role message to the conversation.
  yield* L.user`User message here.`

  // For inferring the next message from the current model.
  const inference = yield* L.assistant
  //    ^?
}
```

## Running Strands

Strands are `PromiseLike` values. `await` or call `then` on the strand to run
it.

```ts
// awaiting
await L.strand(function*() {})

// thenning
L.strand(function*() {}).then()
```

## Catching Errors

Let's use `L.catch` to ensure that we capture any exceptions thrown by the
iterator at runtime.

```ts
import { L } from "liminal"

// Hypothetical function that may throw an exception.
declare function mayThrow(): number

// Run the strand.
await L.strand(function*() {
  const result = yield* L.catch(function*() {
    return mayThrow()
  })

  result satisfies `CatchResult<number>`
})
```

We can discriminate the `CatchResult` like so.

```ts
if (result.resolved) {
  console.log("Succeed with the following value:", result.resolved)
} else {
  console.log("Threw the following value:", result.rejected)
}
```

## Parallelization

Each of the following strands has their own isolated copy of the outer's state.

```ts
function* g() {
  yield* L.user`It's halloween night!`

  const results = yield* L.all({
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

## Self-Reflection

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

<!-- ## Rune Type Signature

The type signature of a `Rune` will contain the event type of `L.event`-produced
yields.

```ts
g satisfies () => Generator<Rune<"my-event">, void>

function* g() {
  yield* L.event("my-event")
}
```

The statically-inferred yield types are used to narrow the signature of
configured event handlers.

```ts
await L.strand(function*() {
  yield* L.event("my-first-event")
  yield* L.event("my-second-event")
}, {
  handler(event) {
    event satisfies "my-first-event" | "my-second-event"
  },
})
``` -->

## Conversation Definition

```ts
// Usually created with a generator function.
declare g: () => Iterable<Rune, any> | AsyncIterable<Rune, any>

// With a nullary function that produces a rune iterable.
const a = await L.run(g)
a satisfies string

// With the rune iterable itself.
const b = await run(g())
b satisfies string

// `L.all` passed a statically-typed tuple of definitions.
const c = L.run(L.all([g, g()]))
c satisfies [string, string]

// `L.all` passed an unsized array of definitions.
const d = L.run(L.all(Array.from({ length }, g)))
d satisfies Array<string>

// `L.all` passed a record of definitions.
const e = L.run(L.all({ a: g, b: g() }))
e satisfies { a: string; b: string }
```

## Core Runes

The following is a non-exhaustive list of Liminal's core runes.

| Factory       | Description                                                                            | Returns                                     |
| ------------- | -------------------------------------------------------------------------------------- | ------------------------------------------- |
| `L.adapter`   | Push a new conversation adapter to the stack.                                          | `Adapter`                                   |
| `L.system`    | Append a system-role message to the message list.                                      | `void`                                      |
| `L.user`      | Append a user-role message to the message list.                                        | `void`                                      |
| `L.assistant` | Append an assistant-role message to the message list.                                  | `void`                                      |
| `L.messages`  | Retrieve the current list of messages.                                                 | `Array<Message>`                            |
| `L.stream`    | Stream a completion with the current model.                                            | `ReadableStream<string>`                    |
| `L.strand`    | Create a child strand with an isolated copy of the current conversation.               | The definition's return type                |
| `L.all`       | Create parallel child strands, each with an isolated copy of the current conversation. | A collection of the definition return types |
| `L.tool`      | Enable a tool for use by the agent.                                                    | `Tool`                                      |
| `L.emit`      | Emit some arbitrary data for use by observers of the agent.                            | `void`                                      |
| `L.catch`     | Execute an agent-like and capture either the resulting value or any throws.            | `CatchResult<T>`                            |

### Message State

Every strand has an isolated list of messages, which serve as context when it
wants to interact with a language model.

<!-- dprint-ignore -->

```ts
// Append a system message.
yield* L.system`A`

// Append a user message.
yield* L.user`B`
```

When executed within an agent, these two yields will append the following two
messages to the agent's conversation.

```json
{
  "role": "system",
  "content": "A"
},
```

```json
{
  "role": "user",
  "content": "B"
}
```

## Return Values

The yielding of Runes may return "next" values.

For example, `yield* L.assistant` returns the model's inference. Let's use the
`L.assistant` Rune to implement prompt-chaining.

```ts
import { L } from "liminal"

export default function*() {
  // Append a user message.
  yield* L.user`Suggest a focused subtopic within technological futurism.`

  // Capture the model's response.
  const subtopic = yield* L.assistant

  // Base the next user message on how the model responded.
  yield* L.user`
    Explain three ways ${subtopic} might impact everyday life by 2030.
  `

  // Capture the final response for the return value.
  const impacts = yield* L.assistant

  // Return structured data from the conversation
  return { subtopic, impacts }
}
```

This kind of chaining is the means by which we create agents with Liminal
strands; each inference can guide the next through dynamic, contextual prompts.
