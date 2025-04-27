# Liminal Strands <Badge type="warning" text="beta" />

A "strand" is a conversation state isolate. Each strand has its own registry of
messages, models, tools and other such locals.

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
}
```

## Yielded vs. Awaited

Strands can be yielded within other strands.

```ts
L.strand(function*() {
  const result = yield* L.strand(function*() {
    // ...
  })
})
```

They can also be awaited.

```ts
const result = await L.strand(function*() {
  //
})
```

## Strand Configuration

Strands are configurable.

```ts
export interface StrandConfig<T = any, E = any> {
  handler?: ((this: Fiber<T>, event: E) => void) | undefined
  models?: ModelRegistry | undefined
  messages?: MessageRegistry | undefined
  tools?: ToolRegistry | undefined
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

## Runics

Strands can be created with any value that is "Runic."

```ts
// Example conversation definition.
function* g() {
  yield* L.user`Salutations.`
  return yield* L.assistant
}

// With a nullary function that produces a rune iterable.
const a = await strand(g)
a satisfies string

// With the rune iterable itself.
const b = await strand(g())
b satisfies string

// With a statically-typed tuple of runics.
const c = strand([g, g()])
c satisfies [string, string]

// With an unsized array of runics.
const d = strand(Array.from({ length }, g))
d satisfies Array<string>

// With a record of runics.
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

## Returned Values

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
