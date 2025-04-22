# Liminal Agents <Badge type="warning" text="beta" />

Liminal agents are defined with
[iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator)
objects that yield "directives."

For example, the following agent creates and appends a user-role message to the
messages underlying the agent.

```ts {4,6}
function* g() {
  yield* L.user`User message here.`
}
```

## Directives

Directives are the means by which we interact with an agent's state, models and
host.

We can access directive-related bindings off of the `L` namespace.

```ts
// For declaring and changing the current model.
L.model("reasoning")

// For appending a user-role message to the conversation.
L.user`User message here.`

// For retrieving the current list of messages.
L.messages
```

### Intrinsic Directives

The following are Liminal's intrinsic directives. They are covered in greater
depth in later sections of this documentation.

| Factory       | Description                                                                                 | Returns           |
| ------------- | ------------------------------------------------------------------------------------------- | ----------------- |
| `L.focus`     | Push a new subject to the subject stack.                                                    | `Model`           |
| `L.snapshot`  | Get an immutable snapshot of the current conversation.                                      | `Snapshot`        |
| `L.messages`  | Retrieve all messages (potentially filtered with selectable types such as slices and tags). | `Array<Message>`  |
| `L.system`    | Append a system-role message to the message list.                                           | `void`            |
| `L.user`      | Append a user-role message to the message list.                                             | `void`            |
| `L.assistant` | Append an assistant-role message to the message list.                                       | `void`            |
| `L.reply`     | Trigger a completion with the current model and append it to the message list.              | `T`               |
| `L.stream`    | Stream a completion with the current model and append the aggregate to the message list.    | `LStream<T>`      |
| `L.mark`      | Conceptually similar to a bookmark.                                                         | `Mark`            |
| `L.call`      | TODO.                                                                                       | `Mark`            |
| `L.tag`       | Create a tag with which to group messages.                                                  | `Tag`             |
| `L.branch`    | Create one or more agents, each with an isolated copy of the current conversation.          | `BranchResult<A>` |
| `L.tool`      | Enable a tool for use by the agent.                                                         | `Tool`            |
| `L.event`     | Emit some arbitrary data for use by observers of the agent.                                 | `void`            |
| `L.catch`     | Execute an agent-like and capture either the resulting value or any throws.                 | `CatchResult<T>`  |

## Agent-like Values

Agents can take the form of iterators and iterables, such as generators, sets
and arrays.

```ts
type Agent<Y extends Rune, T> =
  | Iterator<Y, T>
  | AsyncIterator<Y, T>
  | Iterable<Y, T>
  | AsyncIterable<Y, T>
```

Agents can also take the form of nullary functions which return the
aforementioned values.

```ts
type AgentLike = AgentLikeValue | (() => AgentLikeValue)
```

> Runic Resolution Priority
>
> - `Iterator`
> - `Iterable`
> - `() => Iterable`

### Messages

Every agent has a list of messages, which serve as context when it wants to
interact with a language model.

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

Directive execution often returns directive-specific "next" values. For example,
`reply` returns a next value of `AssistantMessage<T>` where `T` is either
`string` or a specified structured output type.

This is how we implement prompt-chaining.

```ts
import { L } from "liminal"

export default function*() {
  // Append a user message.
  yield* L.user`Suggest a focused subtopic within technological futurism.`

  // Capture the model's response.
  const { value: subtopic } = yield* L.reply

  // Base the next user message on how the model responded.
  yield* L.user`
    Explain three ways ${subtopic} might impact everyday life by 2030.
  `

  // Capture the final response for the return value.
  const { value: impacts } = yield* L.reply

  // Return structured data from the conversation
  return { subtopic, impacts }
}
```

We can sequence directive yields and use their results to create
subsequently-yielded directives; this allows us to model agents that guide
conversations with dynamic, contextual prompts and return structured data for
ease of integration.

## Composition

Because Liminal Agents are iterable protocol objects, we can use standard
JavaScript to create and compose agents.

For example, let's create a reusable iterative refinement agent.

```ts
import { L } from "liminal"

function* refine(content: string, iterations = 3) {
  for (let i = iterations; i < iterations.length; i++) {
    yield* L.user`Refine the following content: ${content}`
    content = yield* L.reply
  }
  return content
}
```

Here the `refine` agent will iterate through multiple rounds of improvements,
with each iteration building on the previous response.

Let's flatten this agent into another agent.

```ts{4}
function* consumer() {
  yield* L.user`Write an itinerary for a family vacation in Costa Rica!`
  const itinerary = yield* L.reply
  const refined = yield* refine(itinerary)
}
```

## Isolation

In the example above, the actions yielded within `refine` are applied to
`consumer`. To isolate the refinement loop's conversation / prevent it from
polluting the outer conversation, we can simply wrap our `refine` call with
`L.branch`.

```ts{4}
function* parent() {
  yield* L.user`Write an itinerary for a family vacation in Costa Rica!`
  const itinerary = yield* L.reply
  const refined = yield* L.branch(refine(itinerary))
}
```

## Parallelization

To execute multiple agents in parallel, we can pass an array or record of
agent-like objects into `L.branch`.

In the following example, we create two branches, each executing the refinement
loop with a different model. Each child agent––`a` and `b`––have their own
isolated state (inheriting a copy of the parent's messages at the point of
branch creation).

```ts{5-14}
function* parent() {
  yield* L.user`Write an itinerary for a family vacation in Costa Rica!`
  const itinerary = yield* L.infer

  const { a, b } = yield* L.branch({
    *a() {
      yield* L.model("model-a")
      return yield* refine(itinerary)
    },
    *b() {
      yield* L.model("model-b")
      return yield* refine(itinerary)
    },
  })
}
```
