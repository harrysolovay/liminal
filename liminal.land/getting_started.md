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

### Example Problem

Let's consider a function that validates an email. Our initial implementation
may look as follows.

```ts
function validateEmail(email: string) {
  if (!EMAIL_REGEX.test(email)) {
    return { error: "Invalid email format." }
  }
  return { valid: true }
}
```

Downside of this implementation: the error message we return is opaque. If
provided to an end user, they may be confused about why the email they provided
is invalid.

### Solution

Let's turn our function into a Liminal agent and infer a helpful validation
message.

```ts {7-9}
import { openai } from "@ai-sdk/openai"
import { Agent, L } from "liminal"
import { ai } from "liminal-ai"

export function* validateEmail(email: string) {
  if (!EMAIL_REGEX.test(email)) {
    yield* L.model(ai(openai("gpt-4o-mini"))) // 1. Specify the language model.
    yield* L.user`Why is the following email is invalid?: "${email}".` // 2. Ask a question.
    const error = yield* L.assistant // 3. Infer the answer.
    return { error }
  }
  return { valid: true }
}
```

#### Running `validateEmail`

To make use of the updated `validateEmail`, we import and call with `Agent`.

```ts {7}
// ...

export function validationEndpoint(request: Request) {
  const formData = await request.formData()
  const email = formData.get("email")?.toString()
  if (email) {
    const result = await Agent(validateEmail(email))
    return Response.json(result)
  }
  // ...
}
```

If the supplied email address is invalid, we may get error messages similar to
the following.

- `john..doe@example`: Your email is missing the top-level domain (like .com or
  .org) after 'example'.
- `user@domain`: Your email address is incomplete and missing the domain
  extension.
- `john@example..com`: Your email contains consecutive dots which aren't allowed
  in a valid address.

## Next Steps

In the next section, we dive deep into what makes something an "agent" in
Liminal.
