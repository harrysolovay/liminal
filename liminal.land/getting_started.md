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

In this example, we imbue the `validateEmail` function with agentic capabilities
by (A) appending an asterisk to the `function` keyword and later (B) calling it
with Liminal's `exec` function.

```diff
- export function validateEmail(email: string) {
+ export function* validateEmail(email: string) {

// ...

- const result = await validateEmail(email)
+ const result = await exec(validateEmail(email), {
+   default: AILanguageModel(openai("gpt-3.5-turbo")),
+ })
```

## Expected Results

When we call `exec` with our `validateEmail` agent, we expect everything to be
the same except that we use a language model to generate the validation error
message.

```txt
"john..doe@example" → "Your email is missing the top-level domain (like .com or .org) after 'example'."
```

```txt
"user@domain" → "Your email address is incomplete and missing the domain extension."
```

```txt
"john@example..com" → "Your email contains consecutive dots which aren't allowed in a valid address."
```

## Next Steps

In the next section, we dive deep into what makes something an "agent" in
Liminal.
