---
prev: false
---

# Getting Started <Badge type="warning" text="beta" />

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

Let's consider a function that validates an email input from a form. Our initial
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

```ts {3,5-6}
import { L } from "liminal"

export function* validateEmail(email: string) {
  if (!EMAIL_REGEX.test(email)) {
    yield* L.model("default")
    yield* L.user`Why is the following email is invalid?: "${email}".`
    const error = yield* L.infer
    return { error }
  }
  return { valid: true }
}
```

## Running Agents

To make use of `validateEmail`, we use `exec` and specify the desired model(s).

```ts {10-12}
import { exec, L } from "liminal"

import { openai } from "@ai-sdk/openai"
import { AILanguageModel } from "liminal-ai"

export function validationEndpoint(request: Request) {
  const formData = await request.formData()
  const email = formData.get("email")?.toString()
  if (email) {
    const result = await exec(validateEmail(email), {
      default: AILanguageModel(openai("gpt-3.5-turbo")),
    })
    return Response.json(result)
  }
  // ...
}
```

## Agentic Behavior

In this example, we imbue the `validateEmail` function with agentic
capabilities, merely by appending an asterisk to the `function` keyword.

```diff
- export function validateEmail(email: string) {
+ export function* validateEmail(email: string) {
```

We can yield messages, LLM replies and other useful directives (see
[core directives here](./agents.md#intrinsic-directives)).

## Expected Results

When `exec`uted, our `validateEmail` agent will now use the language model to
deduce the validation error message.

```txt
"john..doe@example" → "Your email is missing the top-level domain (like .com or .org) after 'example'."
```

```txt
"user@domain" → "Your email address is incomplete and missing the domain extension."
```

```txt
"john@example..com" → "Your email contains consecutive dots which aren't allowed in a valid address."
```
