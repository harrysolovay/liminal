# Liminal Strands <Badge type="warning" text="beta" />

A "strand" is a conversation isolate. Each strand has its own registry of
messages, models, tools and other locals.

```ts
function* g() {
  yield* L.strand(function*() {
    // Isolated from both `g` and from the next strand.
    yield* L.user`A`
  })

  yield* L.strand(function*() {
    // Isolated from both `g` and the previous strand.
    yield* L.user`B`
  })

  // `g` unaffected by the child strands.
}
```

## Running Strands

Strands are `PromiseLike` values. `await` the strand to run it.

```ts
await L.strand(function*() {
  // ...
})
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

## Strand Configuration

Strands are configurable.

```ts
export interface StrandConfig<T = any, E = any, TE = never> {
  /** The handler to be supplied yielded events at runtime. */
  handler?: ((this: Fiber, event: E) => void) | undefined

  /** The language model registry. */
  models?: ModelRegistry | undefined

  /** The initial message state. */
  messages?: MessageRegistry | undefined

  /** Tools that should be made available to language models. */
  tools?: ToolRegistry<TE> | undefined

  /** A signal that can be used to terminate the strand. */
  signal?: AbortSignal | undefined
}
```

### Branching

A common configuration is that of `L.branch`, which creates copies most of the
current strand state into the new strand (with the exceptions of `tools` and
`signal`).

```ts {7}
function* g() {
  yield* L.user`Message to be inherited.`

  // Fork the current context.
  yield* L.strand(function*() {
    // ...
  }, L.branch)
}
```

### Custom Configuration

Alternatively, specify a custom configuration.

```ts
function* g() {
  const controller = new AbortController()

  yield* L.strand(
    function*() {
    },
    {
      handler(event) {
        if (MyEvent.is(event)) {
          // ...
        }
      },
      models: new ModelRegistry(),
      messages: new MessageRegistry(),
      tools: new ToolRegistry(),
      signal: controller.signal,
    },
  )
}
```

### Yielding vs. Awaiting

Strands can be composed within one another via yielding.

```ts {3}
L.strand(function*() {
  const result = yield* L.strand(function*() {
    // ...
  })
})
```

They can also be awaited to start the conversation runtime.

```ts {1}
const result = await L.strand(function*() {
  //
})
```

## Runes

Liminal conversations are defined as
[JavaScript Iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator)
of type "Rune."

Runes are the directives we yield to tell the Liminal runtime how to manage the
conversation state and interact with language models.

<!-- dprint-ignore -->
```ts
// For appending a user-role message to the conversation.
yield* L.user`User message here.`

// For inferring the next message from the current model.
const inference = yield* L.assistant

// For retrieving the current list of messages.
yield* L.messages
```

### Rune Type Signature

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
```

## Conversation Definition

```ts
// Usually created with a generator function.
declare g: () => Iterable<Rune, any> | AsyncIterable<Rune, any>

// With a nullary function that produces a rune iterable.
const a = await strand(g)
a satisfies string

// With the rune iterable itself.
const b = await strand(g())
b satisfies string

// With a statically-typed tuple of definitions.
const c = strand([g, g()])
c satisfies [string, string]

// With an unsized array of definitions.
const d = strand(Array.from({ length }, g))
d satisfies Array<string>

// With a record of definitions.
const e = strand({ a: g, b: g() })
e satisfies { a: string; b: string }
```

### Core Runes

The following is a non-exhaustive list of Liminal's core runes.

| Factory       | Description                                                                        | Returns                  |
| ------------- | ---------------------------------------------------------------------------------- | ------------------------ |
| `L.model`     | Push a new model to the model stack.                                               | `Model`                  |
| `L.system`    | Append a system-role message to the message list.                                  | `void`                   |
| `L.user`      | Append a user-role message to the message list.                                    | `void`                   |
| `L.assistant` | Append an assistant-role message to the message list.                              | `void`                   |
| `L.messages`  | Retrieve the current list of messages.                                             | `Array<Message>`         |
| `L.stream`    | Stream a completion with the current model.                                        | `ReadableStream<string>` |
| `L.strand`    | Create one or more agents, each with an isolated copy of the current conversation. | `StrandResult<A>`        |
| `L.tool`      | Enable a tool for use by the agent.                                                | `Tool`                   |
| `L.event`     | Emit some arbitrary data for use by observers of the agent.                        | `void`                   |
| `L.catch`     | Execute an agent-like and capture either the resulting value or any throws.        | `CatchResult<T>`         |

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
