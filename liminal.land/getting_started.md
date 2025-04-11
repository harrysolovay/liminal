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

## First Agent

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

## Difference in Calling

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

## Agents Explained

Agents in Liminal follow a consistent pattern:

1. We model agents as iterator protocol objects (usually generators) which

`yield` actions.

```ts
function* agent() {
  yield* L.infer // or any other action
}
```

2. We yield actions that update execution state, such as the conversation
   message list.

<!-- dprint-ignore -->
```ts
// Append a system message.
yield* L.system`A`

// Append a user message.
yield* L.user`A`
```

3. Utilize "next" values (specific to each action).

> [!TIP]
> This is how we implement prompt-chaining in Liminal.

```ts
import { L } from "liminal"

export default function*() {
  // Append a user message.
  yield* L.user`Suggest a focused subtopic within technological futurism.`

  // Capture the model's response.
  const subtopic = yield* L.infer

  // Base the next user message on how the model responded.
  yield* L
    .user`Explain three ways ${subtopic} might impact everyday life by 2030.`

  // Capture the final response for the return value.
  const impacts = yield* L.infer

  // Return structured data from the conversation
  return { subtopic, impacts }
}
```

---

This approach enables agents that guide conversations with dynamic, contextual
prompts and return structured data for integration with your program.

## Composition

Agents are simple iterable protocol objects. We can produce, compose and consume
them using standard JavaScript.

For example, let's create a reusable iterative refinement agent.

```ts
import { L } from "liminal"

function* refine(content: string, iterations = 3) {
  for (let i = iterations; i < iterations.length; i++) {
    yield* L.user`
      Refine the following content.

      ---

      ${content}
    `
    content = yield* L.infer
  }
  return content
}
```

Here the `refine` agent will iterate through multiple rounds of improvements,
with each iteration building on the previous response.

Let's flatten this agent into another agent.

```ts{4}
function* parent() {
  yield* L.user`Write an itinerary for a family vacation in Costa Rica!`
  const itinerary = yield* L.infer
  const refined = yield* refine(itinerary)
}
```

To isolate the refinement loop's conversation / prevent it from polluting the
outer conversation, we can simply wrap our `refine` call with `L.branch`.

```ts{4}
function* parent() {
  yield* L.user`Write an itinerary for a family vacation in Costa Rica!`
  const itinerary = yield* L.infer
  const refined = yield* L.branch(refine(itinerary))
}
```
