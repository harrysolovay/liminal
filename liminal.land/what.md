# What is Liminal?

## Agent Descriptions

Liminal provides the `L` namespace, which contains factories and values that
describe agent behavior.

```ts
L.model // Used to change the current model mid-conversation.
L.infer // Used to trigger a completion.
L.embed // Used to get the vector embedding of a string.
```

## Agent Composition

Liminal actions can be yielded from iterator protocol objects (such as
generators).

```ts
function* g() {
  // Append a system message.
  yield* L.system`Be very specific.`

  // Append a user message.
  yield* L.user`Answer my question.`

  // Get a completion, append as an assistant message.
  const answer = yield* L.infer
}
```

## Conversation Management

When we execute a Liminal agent, its underlying conversation is tracked by
liminal.

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

## Standard JavaScript

Liminal agents can colocate ordinary JavaScript code with action yields.
Standard control flow such as imperative loops and async/await is perfectly
valid.

```ts
async function* g() {
  yield* L.system`...`

  const item = await db.getItem({/* ... */})

  while (Math.random() < .9) {
    yield* L.infer
  }

  // ...
}
```

## Composable

We can use generators to create and reuse complex patterns such as iterative
refinement loops.

```ts
function* refine(input: string) {
  let i = 0
  let current = input
  while (i < 5) {
    yield* L.user`Improve the following text: ${current}`
    current = yield* L.infer
  }
  return current
}
```

## Standard-type Compatible

We can provide common standard types to get typed structured output.

```ts
function* g() {
  const b = yield* L.infer(z.object({
    first: L.string,
    second: L.string,
  }))

  b satisfies {
    first: string
    second: string
  }
}
```

## An Agent Runtime

We pass the Agent (a JavaScript iterator protocol objects) to `exec`, which runs
it and returns the final value if any.

```ts
await exec(g, {
  default: defaultModel,
})

declare const defaultModel: LanguageModel
```

## A Means of Observing Agents

Within agents, we can emit events that contain arbitrary data. This enables us
to then listen for those events throughout agent execution.

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

## Agent Orchestration

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
}
```
