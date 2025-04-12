# Liminal Actions

Actions are the means by which we interact with an agent's underlying state, AI
models and observers. We can access actions and actor generator factories on the
`L` namespace.

```ts
L.model("reasoning")
L.user`User message here.`
L.snapshot
```

We ultimately want to yield these values so that they can be interpreted by
Liminal, hence these `L` members provide iterator objects for yielding. For
example:

```ts {4,6}
function* g() {
  const message = L.user`User message here.`

  message satisfies Iterator<AppendMessage, Message>

  yield* message
}
```

## Agent-like Values

In the example above, we define our agent-like as a generator function. However,
Liminal treats as agent-like any iterator protocol object that yields actions.

```ts
type AgentLikeValue =
  | Iterator<Action>
  | AsyncIterator<Action>
  | Iterable<Action>
  | AsyncIterable<Action>
```

Functions that return these iterator protocol objects are also agent-like.

```ts
type AgentLike = AgentLikeValue | (() => AgentLikeValue)
```

## Intrinsic Actions

The following is an overview of Liminal's intrinsic actions.

<!-- TODO: links to code -->

| Factory      | Description                                                                                 | Returns           |
| ------------ | ------------------------------------------------------------------------------------------- | ----------------- |
| `L.snapshot` | Get an immutable snapshot of the current agent state.                                       | `Set<Message>`    |
| `L.message`  | Append a message to the conversation.                                                       | `Message`         |
| `L.model`    | Declare a key to which the executor can bind a model.                                       | `Model`           |
| `L.infer`    | Trigger a completion with the current model and append that completion to the conversation. | `T`               |
| `L.enable`   | Enable a tool for use by the agent.                                                         | `Tool`            |
| `L.embed`    | Trigger the vectorization of an input string.                                               | `Array<number>`   |
| `L.event`    | Emit some arbitrary data for use by observers of the agent.                                 | `void`            |
| `L.branch`   | Create one or more agents, each with an isolated copy of the current conversation.          | `BranchResult<A>` |
| `L.catch`    | Execute an agent-like and capture either the resulting value or any throws.                 | `ExecResult<T>`   |
| `L.forget`   | Remove a memory from the agent state.                                                       | `void`            |

## Derived Actions

Liminal also provides derived actions for convenience. A commonly used example
is `L.user`.

```diff
- L.message({
-   role: "user",
-   message: "User message here.",
- })
+ L.user`User message here.`
```

| Action        | Description                                          | Returns            |
| ------------- | ---------------------------------------------------- | ------------------ |
| `L.user`      | Append a user-role message to the conversation.      | `UserMessage`      |
| `L.system`    | Append a system-role message to the conversation     | `SystemMessage`    |
| `L.assistant` | Append an assistant-role message to the conversation | `AssistantMessage` |
| `L.tool`      | Append a tool-role message to the conversation       | `ToolMessage`      |
