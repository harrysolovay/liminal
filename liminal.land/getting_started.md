# Getting Started

> [!TIP]
> Read "[What is Liminal?](./what.md)" to get an overview of Liminal's core
> objectives and surface area.

## Installation

Install Liminal with your package manager of choice.

::: code-group

```bash [npm]
npm install liminal
```

```bash [bun]
bun install liminal
```

```bash [deno]
deno add npm:liminal
```

```bash [pnpm]
pnpm install liminal
```

```bash [yarn]
yarn add liminal
```

:::

## First Steps

Let's consider a function that validates an input from a form. Our initial
implementation may look as follows.

```ts
function validateEmail(email: string) {
  if (!EMAIL_REGEX.test(email)) {
    return { error: "Invalid email format." }
  }
  return { success: true }
}
```

In this scenario, the error message we return is opaque. The user viewing the
message may be confused about why their submission is invalid.

Let's turn our function into a Liminal agent and infer a helpful validation
message.

```ts {3,5-8}
import { L } from "liminal"

export function* validateEmail(email: string) {
  if (!EMAIL_REGEX.test(email)) {
    yield* L.user`
      Provide a concise explanation of why the following email is invalid: ${email}
    `
    const error = yield* L.infer
    return { error }
  }
  return { valid: true }
}
```

> [!NOTE]
> We postfixed the `function` keyword with `*`.

### Agentic Behavior

The `L.infer` will now use the language model to create the validation error
message. This requires less effort and the model is perhaps better equipped to
create the message than its manual rules-based counterpart.

```txt
"john..doe@example" → "Your email is missing the top-level domain (like .com or .org) after 'example'."
```

```txt
"user@domain" → "Your email address is incomplete and missing the domain extension."
```

```txt
"john@example..com" → "Your email contains consecutive dots which aren't allowed in a valid address."
```

## Instantiating Agents

When we want to call `validateEmail`, we use `exec`, and specify the desired
model.

```ts {10-13}
import { exec, L } from "liminal"

import { openai } from "@ai-sdk/openai"
import { AILanguageModel } from "liminal-ai"

export function validationEndpoint(request: Request) {
  const formData = await request.formData()
  const email = formData.get("email")?.toString()
  if (email) {
    const result = await exec(
      validateEmail(email),
      AILanguageModel(openai("gpt-3.5-turbo")),
    )
    return Response.json(result)
  }
  // ...
}
```

> [!TIP]
> We can observe events emitted during agent execution.
> [Execution documentation here](./concepts/execution.md).

## Agent-like

"Agents" in Liminal are defined as mere iterator protocol objects (usually
generators) which yield actions. For example, we yield `infer` to get a
completion from the underlying model.

```ts
function* agent() {
  yield* L.infer
}
```

We can yield actions to signal to the agent runtime how to update state, such as
the conversation message list.

<!-- dprint-ignore -->
```ts
// Append a system message.
yield* L.system`A`

// Append a user message.
yield* L.user`B`
```

These two yields result in the following two messages being appended to the
conversation being tracked by the executor.

```json
[
  {
    "role": "system",
    "content": "A"
  },
  {
    "role": "user",
    "content": "B"
  }
]
```

Actions often return action-specific "next" values. For example, `infer` returns
a next value of `string` or a specified structured output type. This is how we
implement prompt-chaining.

```ts
import { L } from "liminal"

export default function*() {
  // Append a user message.
  yield* L.user`Suggest a focused subtopic within technological futurism.`

  // Capture the model's response.
  const subtopic = yield* L.infer

  // Base the next user message on how the model responded.
  yield* L.user`
    Explain three ways ${subtopic} might impact everyday life by 2030.
  `

  // Capture the final response for the return value.
  const impacts = yield* L.infer

  // Return structured data from the conversation
  return { subtopic, impacts }
}
```

By combining actions and their results within iterator objects, we model agents
that guide conversations with dynamic, contextual prompts and return structured
data for straight-forward integration.

## Composition

Agents are simple iterable protocol objects. We can produce, compose and consume
them using standard JavaScript.

For example, let's create a reusable iterative refinement agent.

```ts
import { L } from "liminal"

function* refine(content: string, iterations = 3) {
  for (let i = iterations; i < iterations.length; i++) {
    yield* L.user`Refine the following content: ${content}`
    content = yield* L.infer
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
  const itinerary = yield* L.infer
  const refined = yield* refine(itinerary)
}
```

## Conversation Isolation

In the example above, the actions yielded within `refine` are applied to
`consumer`. To isolate the refinement loop's conversation / prevent it from
polluting the outer conversation, we can simply wrap our `refine` call with
`L.branch`.

```ts{4}
function* parent() {
  yield* L.user`Write an itinerary for a family vacation in Costa Rica!`
  const itinerary = yield* L.infer
  const refined = yield* L.branch(refine(itinerary))
}
```

## Parallel Agents

To execute multiple agents in parallel, we can pass an array or record of
iterator protocol objects into `L.branch`.

In the following example, we create two branches, each executing the refinement
loop with a different model.

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
